# paratus

Agenda and habit tracking app. This repo represents a monorepo of other repos that have been built individually

## TODO

This repo is barely working! I wouldn't copy or clone from it yet! I would love to have create t3 turbo repo work with SST V3 but couldn't figure it out so I dropped turbo and just went with pnpm monorepo but now I'm hacking things together to barely get it to work...

Things that I can't figure out, or have guessed on:

* not sure how to plug in sst.dev v3. For now, I've defined the sst.config.ts at the root of the monorepo and pointed it down to nextjs via path.
* not sure how to build all projects in pnpm. For now, pnpm run build does a recursive call to anything that has a build script. Will eventually need to have an Nx or turbo repo config to help control what dependencies things have but can't get either to work with sst
* pnpm -r dev works to startup both expo and nextjs but logs are mixed so it isn't practical. For now, I'm going down and starting each individually
* same thing for building expo, I'm cd'ing into the expo directory to production production builds.
* I can't figure out how to include the .env.production file in opennext/sst builds so I duplicate the file directly under apps/nextjs so it gets included. Using a CI/github workflow would probably work but haven't gotten that far
