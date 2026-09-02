/// <reference path="./basehub-types.d.ts" />
import { basehub as basehubClient } from "basehub";
import { keys } from "./keys";
import "./basehub.config";

const { BASEHUB_TOKEN } = keys();

const basehub = BASEHUB_TOKEN
  ? basehubClient({ token: BASEHUB_TOKEN })
  : undefined;

/**
 * Untyped passthrough for hand-written query objects. The generated BaseHub
 * types (token builds) and our committed stub types disagree on the exact
 * PumpQuery generic, so the query functions go through this boundary.
 */
const rawQuery = async (query: unknown): Promise<any> => {
  if (!basehub) {
    return undefined;
  }
  return (basehub.query as (q: unknown) => Promise<any>)(query);
};

/* -------------------------------------------------------------------------------------------------
 * Types
 *
 * Hand-written and intentionally loose. IMPORTANT: do not switch these back to
 * `fragmentOn(...)` — that API is typed against the build-time-generated
 * FragmentsMap, which differs per BaseHub project (and doesn't exist at all
 * without a token). Deployment builds must never depend on those keys.
 * -----------------------------------------------------------------------------------------------*/

export type CmsImage = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

export type PostMeta = {
  _slug?: string;
  _title?: string;
  authors?: { _title?: string; xUrl?: string; avatar?: CmsImage }[];
  categories?: { _title?: string }[];
  date?: string;
  description?: string;
  image?: CmsImage;
};

export type Post = PostMeta & {
  body?: { plainText?: string; readingTime?: number };
};

export type LegalPostMeta = {
  _slug?: string;
  _title?: string;
  description?: string;
};

export type LegalPost = LegalPostMeta & {
  body?: { plainText?: string; readingTime?: number };
};

/* -------------------------------------------------------------------------------------------------
 * Selections (plain objects — passed through rawQuery, never type-checked
 * against the generated FragmentsMap)
 * -----------------------------------------------------------------------------------------------*/

const imageSelection = {
  url: true,
  width: true,
  height: true,
  alt: true,
  blurDataURL: true,
};

const postMetaSelection = {
  _slug: true,
  _title: true,
  authors: {
    _title: true,
    avatar: imageSelection,
    xUrl: true,
  },
  categories: {
    _title: true,
  },
  date: true,
  description: true,
  image: imageSelection,
};

const postSelection = {
  ...postMetaSelection,
  body: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
    readingTime: true,
  },
};

const legalPostMetaSelection = {
  _slug: true,
  _title: true,
  description: true,
};

const legalPostSelection = {
  ...legalPostMetaSelection,
  body: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
    readingTime: true,
  },
};

/* -------------------------------------------------------------------------------------------------
 * Blog
 * -----------------------------------------------------------------------------------------------*/

export const blog = {
  postsQuery: {
    blog: {
      posts: {
        items: postMetaSelection,
      },
    },
  },

  latestPostQuery: {
    blog: {
      posts: {
        __args: {
          orderBy: "_sys_createdAt__DESC" as const,
        },
        item: postSelection,
      },
    },
  },

  postQuery: (slug: string) => ({
    blog: {
      posts: {
        __args: {
          filter: {
            _sys_slug: { eq: slug },
          },
        },
        item: postSelection,
      },
    },
  }),

  getPosts: async (): Promise<PostMeta[]> => {
    if (!basehub) {
      return [];
    }

    try {
      const data = await rawQuery(blog.postsQuery);
      return data.blog.posts.items;
    } catch {
      return [];
    }
  },

  getLatestPost: async (): Promise<Post | null> => {
    if (!basehub) {
      return null;
    }

    try {
      const data = await rawQuery(blog.latestPostQuery);
      return data.blog.posts.item;
    } catch {
      return null;
    }
  },

  getPost: async (slug: string): Promise<Post | null> => {
    if (!basehub) {
      return null;
    }

    try {
      const query = blog.postQuery(slug);
      const data = await rawQuery(query);
      return data.blog.posts.item;
    } catch {
      return null;
    }
  },
};

/* -------------------------------------------------------------------------------------------------
 * Legal pages
 * -----------------------------------------------------------------------------------------------*/

export const legal = {
  postsMetaQuery: {
    legalPages: {
      items: legalPostMetaSelection,
    },
  },

  postsQuery: {
    legalPages: {
      items: legalPostSelection,
    },
  },

  latestPostQuery: {
    legalPages: {
      __args: {
        orderBy: "_sys_createdAt__DESC" as const,
      },
      item: legalPostSelection,
    },
  },

  postQuery: (slug: string) => ({
    legalPages: {
      __args: {
        filter: {
          _sys_slug: { eq: slug },
        },
      },
      item: legalPostSelection,
    },
  }),

  getPostsMeta: async (): Promise<LegalPostMeta[]> => {
    if (!basehub) {
      return [];
    }

    try {
      const data = await rawQuery(legal.postsMetaQuery);
      return data.legalPages.items;
    } catch {
      return [];
    }
  },

  getPosts: async (): Promise<LegalPostMeta[]> => {
    if (!basehub) {
      return [];
    }

    try {
      const data = await rawQuery(legal.postsQuery);
      return data.legalPages.items;
    } catch {
      return [];
    }
  },

  getLatestPost: async (): Promise<LegalPost | null> => {
    if (!basehub) {
      return null;
    }

    try {
      const data = await rawQuery(legal.latestPostQuery);
      return data.legalPages.item;
    } catch {
      return null;
    }
  },

  getPost: async (slug: string): Promise<LegalPost | null> => {
    if (!basehub) {
      return null;
    }

    try {
      const query = legal.postQuery(slug);
      const data = await rawQuery(query);
      return data.legalPages.item;
    } catch {
      return null;
    }
  },
};
