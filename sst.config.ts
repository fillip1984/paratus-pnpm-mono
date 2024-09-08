/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "paratus",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // const web = await import("./apps/nextjs/sst.config");
    // return {
    //   web,
    // };
    new sst.aws.Nextjs("Web", {
      domain: "paratus.illizen.com",
      path: "apps/nextjs/",
      buildCommand: "turbo run build",
    });
  },
});
