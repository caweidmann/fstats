# caweidmann.dev

The secret code to my secret website, muhahaha. Oh, wait. Can you see this?


## Environments

The website is hosted on Vercel. The website makes use of MUI for styling.

| Environment | URL |
| --- | --- |
| Local | http://localhost:3000/ |
| Vercel - Staging | https://csv-fstats-staging.vercel.app/ |
| Vercel - Production | https://csv-fstats.vercel.app/ |


## Development

Start dev server on [localhost](http://localhost:3000/) with:

```
pnpm dev
```


## Deployment

We use GitHub together with GitHub Actions to push code to staging and production.

Pushing code to a feature branch will trigger a "build-branch" workflow.

Merging/pushing to `develop` will trigger a build on Vercel and a deploy out to staging.

Merging/pushing to `main` will trigger a build on Vercel and a deploy out to production.
