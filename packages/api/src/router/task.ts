import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { PersistedSchema } from "../../../../apps/nextjs/src/trpc/types";
import { protectedProcedure } from "../trpc";

const TaskSchema = PersistedSchema.extend({
  title: z.string(),
  description: z.string().nullish(),
  dueDate: z.string().nullish(),
  priority: z.string().nullish(),
  projectId: z.string().nullish(),
  completedAt: z.date().nullish(),
});

export const taskRouter = {
  create: protectedProcedure
    .input(TaskSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          priority: input.priority,
          projectId: input.projectId,
          createdById: ctx.session.user.id,
        },
      });
    }),
  readAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
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
  }),
  readOne: protectedProcedure
    .input(PersistedSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.task.findUnique({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(TaskSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
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
    }),
  delete: protectedProcedure
    .input(PersistedSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.delete({
        where: {
          id: input.id,
        },
      });
    }),
  inbox: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      where: {
        projectId: null,
        createdById: ctx.session.user.id,
      },
    });
  }),
  inboxCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.count({
      where: {
        projectId: null,
        createdById: ctx.session.user.id,
      },
    });
  }),
} satisfies TRPCRouterRecord;
