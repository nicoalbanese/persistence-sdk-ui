"use client";

import { createChatAction } from "@/lib/actions/chats";
import { useRouter } from "next/navigation";

export const NewChat = () => {
  const router = useRouter();
  return (
    <button
      className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
      onClick={async () => {
        const res = await createChatAction({});
        if (typeof res === "string") {
          return;
        } else {
          router.push(`/chat/${res.id}`);
        }
      }}
    >
      Start New Chat
    </button>
  );
};
