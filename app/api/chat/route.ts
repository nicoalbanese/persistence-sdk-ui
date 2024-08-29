import { createMessage } from "@/lib/api/messages/mutations";
import { getMessageByChatId, getMessageById } from "@/lib/api/messages/queries";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, CoreMessage, streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message, chatId } = await req.json();
  const { messages } = await getMessageByChatId(chatId);
  const updatedMessages: CoreMessage[] = convertToCoreMessages(
    messages ?? [],
  ).concat({ content: message, role: "user" });
  const newMessage = await createMessage({
    chatId,
    content: message,
    role: "user",
  });

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: updatedMessages,
    tools: {
      addTwoNumbers: {
        description: "add two numbers",
        parameters: z.object({ num1: z.number(), num2: z.number() }),
        execute: async ({ num1, num2 }) => {
          return { result: num1 + num2 };
        }
      },
    },
    onFinish: async (message) => {
      await createMessage({
        chatId,
        content: message.text,
        role: "assistant",
      });
    },
  });

  return result.toAIStreamResponse();
}
