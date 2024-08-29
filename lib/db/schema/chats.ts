import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getChats } from "@/lib/api/chats/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const chats = pgTable("chats", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for chats - used to validate API requests
const baseSchema = createSelectSchema(chats).omit(timestamps);

export const insertChatSchema = createInsertSchema(chats).omit(timestamps);
export const insertChatParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateChatSchema = baseSchema;
export const updateChatParams = baseSchema.extend({});
export const chatIdSchema = baseSchema.pick({ id: true });

// Types for chats - used to type API request params and within Components
export type Chat = typeof chats.$inferSelect;
export type NewChat = z.infer<typeof insertChatSchema>;
export type NewChatParams = z.infer<typeof insertChatParams>;
export type UpdateChatParams = z.infer<typeof updateChatParams>;
export type ChatId = z.infer<typeof chatIdSchema>["id"];

// this type infers the return from getChats() - meaning it will include any joins
export type CompleteChat = Awaited<
  ReturnType<typeof getChats>
>["chats"][number];
