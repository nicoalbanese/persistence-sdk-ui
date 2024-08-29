import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  MessageId, 
  NewMessageParams,
  UpdateMessageParams, 
  updateMessageSchema,
  insertMessageSchema, 
  messages,
  messageIdSchema 
} from "@/lib/db/schema/messages";

export const createMessage = async (message: NewMessageParams) => {
  const newMessage = insertMessageSchema.parse(message);
  try {
    const [m] =  await db.insert(messages).values(newMessage).returning();
    return { message: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateMessage = async (id: MessageId, message: UpdateMessageParams) => {
  const { id: messageId } = messageIdSchema.parse({ id });
  const newMessage = updateMessageSchema.parse(message);
  try {
    const [m] =  await db
     .update(messages)
     .set({...newMessage, updatedAt: new Date() })
     .where(eq(messages.id, messageId!))
     .returning();
    return { message: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteMessage = async (id: MessageId) => {
  const { id: messageId } = messageIdSchema.parse({ id });
  try {
    const [m] =  await db.delete(messages).where(eq(messages.id, messageId!))
    .returning();
    return { message: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

