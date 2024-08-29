"use client";

import { deleteChatAction } from "@/lib/actions/chats";
import { Message } from "@/lib/db/schema/messages";
import { CoreMessage } from "ai";
import { useChat, Message as UIMessage } from "ai/react";
import { useRouter } from "next/navigation";

export function Chat({
  initialMessages = [],
  chatId,
}: {
  initialMessages?: Message[];
  chatId: string;
}) {
  const router = useRouter();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 2,
    initialMessages:
      initialMessages.map((m) => ({
        id: m.id,
        content: m.content,
        role: m.role,
      })) ?? [],
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        chatId,
        message: messages[messages.length - 1].content,
      };
    },
  });
  return (
    <div className="">
      <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 ease-in-out"
        onClick={async () => {
          // Add delete chat functionality here
          await deleteChatAction(chatId);
          router.push("/")
        }}
      >
        Delete Chat
      </button>
      {messages.map((m) => (
        <div key={m.id} className="mb-4 p-4 rounded-lg shadow-md bg-gray-100">
          <span className="font-bold text-blue-600">
            {m.role === "user" ? "User: " : "AI: "}
          </span>
          <p className="mt-2 whitespace-pre-wrap">{m.content}</p>
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
      >
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
