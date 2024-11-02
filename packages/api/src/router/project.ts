import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { PersistedSchema } from "../../../../apps/nextjs/src/trpc/types";
import { protectedProcedure } from "../trpc";

const CategorySchema = PersistedSchema.extend({
  title: z.string(),
  description: z.string().nullish(),
  iconName: z.string(),
});

const ProjectSchema = PersistedSchema.extend({
  title: z.string(),
  description: z.string().nullish(),
  category: CategorySchema,
});

export const projectRouter = {
  create: protectedProcedure
    .input(ProjectSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description,
          categoryId: input.category.id,
          createdById: ctx.session.user.id,
        },
      });
    }),
  readAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        createdById: ctx.session.user.id,
      },

      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        _count: { select: { tasks: true } },
      },
      orderBy: { id: "asc" },
    });
  }),
  readOne: protectedProcedure
    .input(PersistedSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.project.findUnique({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw Error("Unable to update without an id");
      }
      return await ctx.db.project.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          categoryId: input.category.id,
          createdById: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
    }),
  createCategory: protectedProcedure
    .input(CategorySchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.category.create({
        data: {
          title: input.title,
          description: input.description,
          iconName: input.iconName,
        },
      });
    }),
  readAllCategories: protectedProcedure.query(async ({ ctx }) => {
    let results = await ctx.db.category.findMany();
    if (results.length === 0) {
      console.log("Loading sample categories");
      results = await ctx.db.category.createManyAndReturn({
        data: [
          {
            title: "Career",
            iconName: "MdBusinessCenter",
          },
          {
            title: "Chores",
            iconName: "GiBroom",
          },
          {
            title: "Entertainment",
            iconName: "SiApplearcade",
          },
          {
            title: "Finance",
            iconName: "FaMoneyBills",
          },
          {
            title: "Friends/Relationships",
            iconName: "GiThreeFriends",
          },
          {
            title: "Health/Fitness",
            iconName: "GiBiceps",
          },
          {
            title: "Home Improvements",
            iconName: "LuConstruction",
          },
          {
            title: "Mindfulness",
            iconName: "RiMentalHealthFill",
          },
          {
            title: "Periodic Maintenance",
            iconName: "IoConstructSharp",
          },
        ],
      });
    }
    return results;
  }),
} satisfies TRPCRouterRecord;
