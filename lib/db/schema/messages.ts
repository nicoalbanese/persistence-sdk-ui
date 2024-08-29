import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { chats } from "./chats";
import { type getMessages } from "@/lib/api/messages/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const messages = pgTable("messages", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: jsonb("content").notNull(),
  chatId: varchar("chat_id", { length: 256 })
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for messages - used to validate API requests
const baseSchema = createSelectSchema(messages).omit(timestamps);

export const insertMessageSchema =
  createInsertSchema(messages).omit(timestamps);
export const insertMessageParams = baseSchema
  .extend({
    chatId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateMessageSchema = baseSchema;
export const updateMessageParams = baseSchema.extend({
  chatId: z.coerce.string().min(1),
});
export const messageIdSchema = baseSchema.pick({ id: true });

// Types for messages - used to type API request params and within Components
export type Message = typeof messages.$inferSelect;
export type NewMessage = z.infer<typeof insertMessageSchema>;
export type NewMessageParams = z.infer<typeof insertMessageParams>;
export type UpdateMessageParams = z.infer<typeof updateMessageParams>;
export type MessageId = z.infer<typeof messageIdSchema>["id"];

// this type infers the return from getMessages() - meaning it will include any joins
export type CompleteMessage = Awaited<
  ReturnType<typeof getMessages>
>["messages"][number];
