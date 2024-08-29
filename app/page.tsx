import { getChats } from "@/lib/api/chats/queries";
import { NewChat } from "./new-chat";

export default async function Home() {
  const { chats } = await getChats();
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-4 py-16">
      <NewChat />
      <div>
        {chats.map((chat) => (
          <a
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="block p-4 mb-2 bg-white rounded shadow hover:bg-gray-50"
          >
            {chat.id ?? "Untitled Chat"}
          </a>
        ))}
      </div>
    </div>
  );
}
