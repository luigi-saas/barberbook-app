# Observability Rules (Sentry + Logtail)

- Use `@repo/observability/log` for structured logging: `log.info()`, `log.warn()`, `log.error()`
- Use `@repo/observability/error` (`parseError`) to safely convert unknown errors to strings
- Use `@repo/observability/client` and `@repo/observability/server` for Sentry — never import `@sentry/nextjs` directly in app code
- Every `global-error.tsx` file must report to Sentry — do not remove the existing Sentry capture calls
- Never log secrets, tokens, passwords, or full request bodies
- Log at the right level: `info` for expected events, `warn` for degraded but recoverable state, `error` for failures
- In webhook handlers, always log `event.type` on receipt and the result on completion
