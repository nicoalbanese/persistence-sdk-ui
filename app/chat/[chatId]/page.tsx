import { getChatById } from "@/lib/api/chats/queries";
import { Chat } from "./chat";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Message } from "ai/react";

export default async function ChatPage({
  params: { chatId },
}: {
  params: { chatId: string };
}) {
  const { chats } = await getChatById(chatId);
  if (chats === undefined || chats.length === 0) notFound();

  const messages =
    chats?.flatMap((cm) => cm?.messages ?? []) ?? [];

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto stretch py-16">
      <Link
        href="/"
        className="inline-block mb-4 text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-in-out"
      >
        <span className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to chats
        </span>
      </Link>
      <h1 className="text-gray-500 pb-4">Chat ID: {chatId}</h1>
      <Chat chatId={chatId} initialMessages={messages} />
    </div>
  );
}
