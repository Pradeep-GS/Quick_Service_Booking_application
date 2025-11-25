import { useState, useEffect } from "react";
import { Send } from "lucide-react";

export default function Chating() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentSender, setCurrentSender] = useState("user"); // you can change dynamically

  // ----------------------------------------
  // 🔥 LOAD MESSAGES FROM BACKEND
  // ----------------------------------------
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:8080/chat/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  // ----------------------------------------
  // 🔥 SEND MESSAGE TO BACKEND
  // ----------------------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: currentSender,
      text: input,
      time: new Date().toISOString(),
    };

    try {
      await fetch("http://localhost:8080/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      // instantly show in UI
      setMessages((prev) => [
        ...prev,
        { ...newMessage, time: formatTime(newMessage.time) },
      ]);

      setInput("");
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  // Format time
  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-md">
                <div
                  className={`px-5 py-3 rounded-2xl transition-all ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-md shadow-sm"
                      : "bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-200"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      msg.sender === "user" ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 p-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-blue-500 text-white p-3.5 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
