#!/usr/bin/env python3
"""Generate PostgreSQL DDL from the Prisma schema (relationMode = "prisma").

Prisma CLI's schema-engine binary cannot run in restricted sandboxes
(binaries.prisma.sh blocked). With relationMode="prisma" there are no
DB-level foreign keys, so the equivalent DDL is fully deterministic:
CREATE TYPE + CREATE TABLE (PK/unique/index) — nothing else.

Output: scripts/schema.sql  (idempotent: DROP ... IF EXISTS first)
"""
import re
import sys

SCHEMA = "packages/database/prisma/schema.prisma"
OUT = "scripts/schema.sql"

src = open(SCHEMA).read()

# Strip comments
src = re.sub(r"//[^\n]*", "", src)

TYPE_MAP = {
    "String": "text",
    "Int": "integer",
    "BigInt": "bigint",
    "Float": "double precision",
    "Decimal": "decimal(65,30)",
    "Boolean": "boolean",
    "DateTime": "timestamp(3)",
    "Json": "jsonb",
    "Bytes": "bytea",
}
NATIVE = {
    "Text": "text",
    "VarChar": None,  # parameterized, handled inline
    "Decimal": None,
}
LIST_TYPES = {"String", "Int", "BigInt", "Float", "Decimal", "Boolean", "DateTime", "Json", "Bytes"}

enum_names = []
enums_sql = []
for m in re.finditer(r"enum\s+(\w+)\s*\{([^}]*)\}", src):
    name, body = m.group(1), m.group(2)
    values = [v.strip() for v in body.split() if v.strip()]
    enum_names.append(name)
    vals = ", ".join(f"'{v}'" for v in values)
    enums_sql.append(
        f'DROP TYPE IF EXISTS "{name}" CASCADE;\nCREATE TYPE "{name}" AS ENUM ({vals});'
    )

def map_col(ftype, attr):
    base = ftype.rstrip("?").rstrip("[]")
    is_list = ftype.endswith("[]")
    # enum columns use the postgres enum type directly (quoted — case-sensitive)
    if base in enum_names:
        return f'"{base}"' + ("[]" if is_list else "")
    # native @db annotation
    nat = re.search(r"@db\.(\w+)(?:\(([^)]*)\))?", attr)
    col = None
    if nat:
        fname, fargs = nat.group(1), nat.group(2)
        if fname in NATIVE and NATIVE[fname]:
            col = NATIVE[fname]
        elif fname == "VarChar":
            col = f"varchar({fargs})" if fargs else "varchar"
        elif fname == "Decimal":
            col = f"decimal({fargs})" if fargs else "decimal(65,30)"
    if col is None:
        col = TYPE_MAP[base]
    if is_list:
        col += "[]"
    return col

tables_sql = []
indexes_sql = []

for m in re.finditer(r"model\s+(\w+)\s*\{([^}]*)\}", src):
    model, body = m.group(1), m.group(2)
    cols, uniques = [], []
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith("@@"):
            mu = re.match(r"@@unique\(\[(.*?)\]", line)
            if mu:
                fields = [f.strip() for f in mu.group(1).split(",")]
                uniques.append(", ".join(f'"{f}"' for f in fields))
            continue
        fm = re.match(r"(\w+)\s+(\S+)\s*(.*)", line)
        if not fm:
            continue
        fname, ftype, rest = fm.group(1), fm.group(2), fm.group(3)
        if ftype.rstrip("?[]") in enum_names or ftype.rstrip("?[]") in LIST_TYPES:
            if ftype.rstrip("?") not in enum_names and ftype.rstrip("[]?") not in LIST_TYPES:
                continue  # relation field
        else:
            continue  # relation to another model
        attr = rest
        col_type = map_col(ftype, attr)
        parts = [f'"{fname}"', col_type]
        if fname == next(iter(re.findall(r"(\w+)\s+\S+\s+@id", body)), None) and "@id" in attr:
            pass
        if "?" not in ftype:
            parts.append("NOT NULL")
        # defaults
        dm = re.search(r"@default\((\w+\(\)|[^)]+)\)", attr)
        if dm:
            d = dm.group(1).strip()
            base = ftype.rstrip("?[]")
            if d in ("cuid()", "uuid()", "nanoid()", "ksuid()", "ulid()"):
                pass  # client-side
            elif d == "now()":
                parts.append("DEFAULT CURRENT_TIMESTAMP")
            elif d.startswith("dbgenerated("):
                raw = d[len("dbgenerated(") : -1]
                parts.append(f"DEFAULT {raw}")
            elif d.startswith('"'):
                val = "'" + d[1:-1].replace("'", "''") + "'"
                parts.append(f"DEFAULT {val}" + (f'::{base}' if base in enum_names else ""))
            elif d in ("true", "false"):
                parts.append(f"DEFAULT {d}")
            elif re.match(r"^-?\d+(\.\d+)?$", d):
                parts.append(f"DEFAULT {d}")
            elif base in enum_names:
                parts.append('DEFAULT ' + chr(39) + d + chr(39) + '::' + chr(34) + base + chr(34))
            else:
                parts.append(f"DEFAULT {d}")
        if "@unique" in attr and "@id" not in attr:
            parts.append("UNIQUE")
        cols.append("  " + " ".join(parts))
    # single @id
    idm = re.search(r"(\w+)\s+\S+\s+@id", body)
    if idm:
        uniques.append(f'"{idm.group(1)}"') if False else None
        pk = idm.group(1)
        cols.append(f"  PRIMARY KEY (\"{pk}\")")
    cons = ",\n".join(cols)
    if uniques:
        cons += f",\n  UNIQUE ({'), ('.join(uniques)})"
    tables_sql.append(
        f'DROP TABLE IF EXISTS "{model}" CASCADE;\nCREATE TABLE "{model}" (\n{cons}\n);'
    )
    for im in re.finditer(r"@@index\(\[(.*?)\]\)", body):
        fields = [f.strip() for f in im.group(1).split(",")]
        indexes_sql.append(
            f'DROP INDEX IF EXISTS "{model}_{ "_".join(fields)}_idx" CASCADE;'
        )
        indexes_sql.append(
            f'CREATE INDEX "{model}_{ "_".join(fields)}_idx" ON "{model}" ({", ".join(chr(34)+f+chr(34) for f in fields)});'
        )

out = "-- Auto-generated from prisma/schema.prisma (relationMode=prisma: no FKs)\n"
out += "-- Regenerate with: python3 scripts/gen-schema-sql.py\n\n"
out += "CREATE EXTENSION IF NOT EXISTS pgcrypto;\n\n"
out += "\n\n".join(enums_sql) + "\n\n"
out += "\n\n".join(tables_sql) + "\n\n"
out += "\n".join(indexes_sql) + "\n"
open(OUT, "w").write(out)
print(f"wrote {OUT}: {len(enums_sql)} enums, {len(tables_sql)} tables, {len(indexes_sql)//2} indexes")
