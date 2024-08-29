import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  ChatId, 
  NewChatParams,
  UpdateChatParams, 
  updateChatSchema,
  insertChatSchema, 
  chats,
  chatIdSchema 
} from "@/lib/db/schema/chats";

export const createChat = async (chat: NewChatParams) => {
  const newChat = insertChatSchema.parse(chat);
  try {
    const [c] =  await db.insert(chats).values(newChat).returning();
    return { chat: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateChat = async (id: ChatId, chat: UpdateChatParams) => {
  const { id: chatId } = chatIdSchema.parse({ id });
  const newChat = updateChatSchema.parse(chat);
  try {
    const [c] =  await db
     .update(chats)
     .set({...newChat, updatedAt: new Date() })
     .where(eq(chats.id, chatId!))
     .returning();
    return { chat: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteChat = async (id: ChatId) => {
  const { id: chatId } = chatIdSchema.parse({ id });
  try {
    const [c] =  await db.delete(chats).where(eq(chats.id, chatId!))
    .returning();
    return { chat: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

