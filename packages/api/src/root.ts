import { authRouter } from "./router/auth";
import { projectRouter } from "./router/project";
import { todoRouter } from "./router/todo";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  todo: todoRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
