import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const NewTodoSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  dueDate: z.string().nullish(),
  priority: z.string().nullish(),
  projectId: z.string().nullish(),
});
// type NewTodoSchemaType = z.infer<typeof NewTodoSchema>;

export const UpdateTodoSchema = NewTodoSchema.extend({
  id: z.string(),
  completedAt: z.date().nullish(),
});
// type UpdateTodoSchemaType = z.infer<typeof UpdateTodoSchema>;

export const todoRouter = {
  create: protectedProcedure
    .input(NewTodoSchema)
    .mutation(async ({ ctx, input }) => {
      console.log({ input });
      const result = await ctx.db.todo.create({
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          priority: input.priority,
          projectId: input.projectId,
          createdById: ctx.session.user.id,
        },
      });

      return result;
    }),
  readAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.todo.findMany({
      where: {
        createdById: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        completedAt: true,
        dueDate: true,
        priority: true,
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return result;
  }),
  readOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.todo.findUnique({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      return result;
    }),
  update: protectedProcedure
    .input(UpdateTodoSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw Error("Unable to update without an id");
      }
      console.log({ input });
      const result = await ctx.db.todo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          priority: input.priority,
          projectId: input.projectId,
          completedAt: input.completedAt,
        },
      });

      return result;
    }),

  delete: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.todo.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });

      return result;
    }),
  inbox: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.todo.findMany({
      where: {
        projectId: null,
        createdById: ctx.session.user.id,
      },
    });
    return result;
  }),
  inboxCount: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.todo.findMany({
      where: {
        projectId: null,
        createdById: ctx.session.user.id,
      },
    });
    return result.length;
  }),
} satisfies TRPCRouterRecord;
