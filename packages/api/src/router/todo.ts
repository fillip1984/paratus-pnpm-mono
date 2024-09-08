import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const TodoSchema = z.object({
  id: z.number().nullish(),
  text: z.string(),
  complete: z.boolean(),
  timer: z.number(),
});

export type TodoSchemaType = z.infer<typeof TodoSchema>;

export const todoRouter = {
  create: protectedProcedure
    .input(TodoSchema)
    .mutation(async ({ ctx, input }) => {
      // console.log({ input });
      const result = await ctx.db.todo.create({
        data: {
          text: input.text,
          complete: input.complete,
          timer: input.timer,
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
      select: { id: true, text: true, complete: true, timer: true },
      orderBy: { id: "asc" },
    });
    return result;
  }),
  readOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
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
    .input(TodoSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw Error("Unable to update without an id");
      }
      const result = await ctx.db.todo.update({
        where: { id: input.id },
        data: {
          text: input.text,
          complete: input.complete,
          timer: input.timer,
          createdById: ctx.session.user.id,
        },
      });

      return result;
    }),

  delete: protectedProcedure
    .input(z.array(z.number()))
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
} satisfies TRPCRouterRecord;
