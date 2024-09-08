export const web = new sst.aws.Nextjs("Web", {
  domain: "paratus.illizen.com",
  path: "/apps/nextjs",
  buildCommand: "pnpm run build",
});
