# NeMe

> NeMe is Next Messenger. 😃

## Stack

- Next.js
- NextAuth.js
- Tailwind CSS
- Cloudinary
- Pusher
- MongoDB
- Prisma

## Install

```sh
yarn
```

## Usage

```sh
yarn dev
```

## Environment Variables

```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=

NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_ID=
PUSHER_SECRET=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_BASE_URL=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_API_KEY=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Note

1. 비동기 컴포넌트 사용 시 타입에러 해결하기

```tsx
<div>
  {/* @ts-expect-error Server Component */}
  <AsyncComponent />
</div>
```
