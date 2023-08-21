import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({

    getUserByUserName: publicProcedure.
    input(z.object({username: z.string()})).
    query(async ({ input }) => {
        const [user] = await clerkClient.users.getUserList({
            username: [input.username]
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        return filterUserForClient(user);
    })
});