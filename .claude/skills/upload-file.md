---
name: upload-file
description: Triggered when implementing file upload functionality using Vercel Blob
---

# File Upload with Vercel Blob

## Step 1: Import the storage client
```ts
import { put, del, list } from '@repo/storage';
// or for client-side uploads:
import { upload } from '@repo/storage/client';
```

## Step 2: Server-side upload (from server action)
```ts
import { put } from '@repo/storage';

const blob = await put(filename, fileBuffer, {
  access: 'public',
  contentType: mimeType,
});
// blob.url is the public CDN URL
```

## Step 3: Client-side upload (direct browser → Blob)
```ts
import { upload } from '@repo/storage/client';

const blob = await upload(filename, file, {
  access: 'public',
  handleUploadUrl: '/api/upload', // needs a route handler to generate a token
});
```

## Step 4: Create the token endpoint (for client uploads)
Create `apps/app/app/api/upload/route.ts` using `handleUpload` from `@repo/storage`.

## Step 5: Clean up
- Delete blobs when the associated resource is deleted: `await del(blob.url)`
- `BLOB_READ_WRITE_TOKEN` lives in `packages/storage/.env.local`
