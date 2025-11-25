export default function MessageBubble({
  sender,
  text,
}: {
  sender: "ai" | "user";
  text: string;
}) {
  const isAI = sender === "ai";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow 
        ${isAI ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"}`}
      >
        {text.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
