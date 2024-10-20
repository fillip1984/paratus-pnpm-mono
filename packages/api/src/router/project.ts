import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const ProjectSchema = z.object({
  id: z.string().nullish(),
  title: z.string(),
  description: z.string().nullish(),
});

export type ProjectSchemaType = z.infer<typeof ProjectSchema>;

export const projectRouter = {
  create: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ ctx, input }) => {
      // console.log({ input });
      const result = await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description,
          createdById: ctx.session.user.id,
        },
      });

      return result;
    }),
  readAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.project.findMany({
      where: {
        createdById: ctx.session.user.id,
      },
      select: { id: true, title: true, description: true },
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
      const result = await ctx.db.project.findUnique({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      return result;
    }),
  update: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw Error("Unable to update without an id");
      }
      const result = await ctx.db.project.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          createdById: ctx.session.user.id,
        },
      });

      return result;
    }),

  delete: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.project.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });

      return result;
    }),
} satisfies TRPCRouterRecord;
