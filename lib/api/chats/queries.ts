import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type ChatId, chatIdSchema, chats } from "@/lib/db/schema/chats";
import { messages } from "@/lib/db/schema/messages";

export const getChats = async () => {
  const rows = await db.select().from(chats);
  const c = rows;
  return { chats: c };
};

export const getChatById = async (id: ChatId) => {
  const { id: chatId } = chatIdSchema.parse({ id });
  const chatMessages = await db
    .select()
    .from(chats)
    .where(eq(chats.id, chatId))
    .leftJoin(messages, eq(messages.chatId, chatId));
  if (chatMessages === undefined) return {};
  const c = chatMessages;
  return { chats: c };
};
