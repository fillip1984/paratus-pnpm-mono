import { authRouter } from "./router/auth";
import { projectRouter } from "./router/project";
import { taskRouter } from "./router/task";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  task: taskRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
