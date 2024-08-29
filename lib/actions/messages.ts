"use server";

import { revalidatePath } from "next/cache";
import {
  createMessage,
  deleteMessage,
  updateMessage,
} from "@/lib/api/messages/mutations";
import {
  MessageId,
  NewMessageParams,
  UpdateMessageParams,
  messageIdSchema,
  insertMessageParams,
  updateMessageParams,
} from "@/lib/db/schema/messages";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateMessages = () => revalidatePath("/messages");

export const createMessageAction = async (input: NewMessageParams) => {
  try {
    const payload = insertMessageParams.parse(input);
    await createMessage(payload);
    revalidateMessages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateMessageAction = async (input: UpdateMessageParams) => {
  try {
    const payload = updateMessageParams.parse(input);
    await updateMessage(payload.id, payload);
    revalidateMessages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteMessageAction = async (input: MessageId) => {
  try {
    const payload = messageIdSchema.parse({ id: input });
    await deleteMessage(payload.id);
    revalidateMessages();
  } catch (e) {
    return handleErrors(e);
  }
};