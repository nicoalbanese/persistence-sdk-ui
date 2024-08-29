import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import {
  type MessageId,
  messageIdSchema,
  messages,
} from "@/lib/db/schema/messages";
import { ChatId, chatIdSchema, chats } from "@/lib/db/schema/chats";

export const getMessages = async () => {
  const rows = await db
    .select({ message: messages, chat: chats })
    .from(messages)
    .leftJoin(chats, eq(messages.chatId, chats.id));
  const m = rows.map((r) => ({ ...r.message, chat: r.chat }));
  return { messages: m };
};

export const getMessageById = async (id: MessageId) => {
  const { id: messageId } = messageIdSchema.parse({ id });
  const [row] = await db
    .select({ message: messages, chat: chats })
    .from(messages)
    .where(eq(messages.id, messageId))
    .leftJoin(chats, eq(messages.chatId, chats.id));
  if (row === undefined) return {};
  const m = { ...row.message, chat: row.chat };
  return { message: m };
};

export const getMessageByChatId = async (id: ChatId) => {
  const { id: chatId } = chatIdSchema.parse({ id });
  const m = await db
    .select({ message: messages })
    .from(messages)
    .where(eq(messages.chatId, chatId));
  if (m === undefined) return {};
  return { messages: m.map((msg) => msg.message) };
};
