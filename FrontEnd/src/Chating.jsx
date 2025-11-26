import React, { useEffect, useState, useRef } from "react";
import { Send, User, Briefcase, CheckCheck } from "lucide-react";

export default function Chating() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const stompClientRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const initializeChatData = () => {
      const appUserId = localStorage.getItem("appUserId");
      const serviceProviderId = localStorage.getItem("serviceProviderId");
      
      console.log("Stored IDs:", { appUserId, serviceProviderId });

      let senderId, senderType, receiverId, receiverType;

      if (appUserId) {
        senderId = parseInt(appUserId);
        senderType = "USER";
        receiverId = parseInt(localStorage.getItem("chatReceiverId")) || 2;
        receiverType = "PROVIDER";
      } else if (serviceProviderId) {
        senderId = parseInt(serviceProviderId);
        senderType = "PROVIDER";
        receiverId = parseInt(localStorage.getItem("chatReceiverId")) || 1;
        receiverType = "USER";
      }
      setCurrentUser({ id: senderId, type: senderType });
      setReceiver({ id: receiverId, type: receiverType });

      console.log("Chat initialized:", {
        currentUser: { id: senderId, type: senderType },
        receiver: { id: receiverId, type: receiverType }
      });

      return { senderId, senderType, receiverId, receiverType };
    };

    initializeChatData();
  }, []);

  useEffect(() => {
    if (!currentUser || !receiver) return;

    const initWebSocket = async () => {
      try {
        const SockJS = (await import("sockjs-client")).default;
        const { Client } = await import("@stomp/stompjs");

        const socket = new SockJS("http://localhost:8080/ws");
        const stomp = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          debug: (str) => console.log("STOMP:", str),
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        stomp.onConnect = (frame) => {
          console.log("✅ Connected to WebSocket successfully");
          setIsConnected(true);
          const subscription = stomp.subscribe(`/topic/chat.${currentUser.id}`, (msg) => {
            console.log("📨 Received message:", msg.body);
            try {
              const data = JSON.parse(msg.body);
              setMessages((prev) => {
                const isDuplicate = prev.some(m => 
                  m.id === data.id || 
                  (m.senderId === data.senderId && 
                   m.receiverId === data.receiverId && 
                   m.message === data.message && 
                   Math.abs(new Date(m.timestamp) - new Date(data.timestamp)) < 1000)
                );
                
                if (!isDuplicate) {
                  return [...prev, data];
                }
                return prev;
              });
            } catch (error) {
              console.error("❌ Error parsing message:", error);
            }
          });
          console.log(`📡 Subscribed to: /topic/chat.${currentUser.id}`);
          loadChatHistory();
        };

        stomp.onStompError = (frame) => {
          console.error("❌ STOMP Error:", frame.headers["message"]);
          console.error("Error details:", frame.body);
          setIsConnected(false);
        };

        stomp.onWebSocketError = (error) => {
          console.error("❌ WebSocket error:", error);
          setIsConnected(false);
        };

        stomp.onDisconnect = () => {
          console.log("🔌 Disconnected from WebSocket");
          setIsConnected(false);
        };

        stomp.activate();
        stompClientRef.current = stomp;

      } catch (error) {
        console.error("❌ WebSocket initialization error:", error);
        setIsConnected(false);
      }
    };

    const loadChatHistory = async () => {
      if (!currentUser || !receiver) return;

      try {
        console.log("📖 Loading chat history...");
        let userId, providerId;
        if (currentUser.type === "USER") {
          userId = currentUser.id;
          providerId = receiver.id;
        } else {
          userId = receiver.id;
          providerId = currentUser.id;
        }

        console.log("Fetching history with:", { userId, providerId });

        const response = await fetch(
          `http://localhost:8080/chat/history?userId=${userId}&providerId=${providerId}`
        );
        
        if (response.ok) {
          const history = await response.json();
          console.log("✅ Chat history loaded:", history);
          const sortedHistory = (history || []).sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
          
          setMessages(sortedHistory);
        } else {
          console.error("❌ Failed to load chat history:", response.status);
        }
      } catch (error) {
        console.error("❌ Error loading chat history:", error);
      }
    };
    loadChatHistory();
    initWebSocket();

    return () => {
      if (stompClientRef.current) {
        console.log("🧹 Cleaning up WebSocket connection");
        stompClientRef.current.deactivate();
      }
    };
  }, [currentUser, receiver]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentUser || !receiver) {
      console.warn("Cannot send message: missing data");
      return;
    }
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("STOMP is not connected yet!");
      return;
    }

    const msgObj = {
      senderId: currentUser.id,
      receiverId: receiver.id,
      senderType: currentUser.type,
      receiverType: receiver.type,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Sending message:", msgObj);

    try {
      stompClientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(msgObj),
      });

      console.log("✅ Message sent successfully");
      setInputMessage("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (error) {
      return "Now";
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Today";
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4169E1] mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#4169E1] rounded-full flex items-center justify-center shadow-md">
              {currentUser.type === "USER" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Briefcase className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                {currentUser.type === "USER" ? "Service Provider" : "Customer"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isConnected ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    Connecting...
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Start the conversation by sending your first message!
              </p>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, dayMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-6">
                  <div className="bg-white px-3 py-1 rounded-full border border-gray-200">
                    <span className="text-xs font-medium text-gray-500">
                      {formatDate(dayMessages[0].timestamp)}
                    </span>
                  </div>
                </div>

                {/* Messages for this date */}
                {dayMessages.map((msg, i) => {
                  const isSender = msg.senderId === currentUser.id && msg.senderType === currentUser.type;
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex ${isSender ? "justify-end" : "justify-start"} mb-3`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          isSender ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isSender
                                ? "bg-[#4169E1]"
                                : "bg-gray-400"
                            }`}
                          >
                            {msg.senderType === "USER" ? (
                              <User className="w-3 h-3 text-white" />
                            ) : (
                              <Briefcase className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>

                        {/* Message bubble */}
                        <div
                          className={`flex flex-col ${
                            isSender ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isSender
                                ? "bg-[#4169E1] text-white rounded-br-md"
                                : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">
                              {msg.message}
                            </p>
                          </div>
                          
                          {/* Timestamp and status */}
                          <div
                            className={`flex items-center gap-1 mt-1 px-1 ${
                              isSender ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <span
                              className={`text-xs ${
                                isSender ? "text-blue-200" : "text-gray-400"
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </span>
                            {isSender && (
                              <CheckCheck className="w-3 h-3 text-blue-200" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isConnected 
                    ? "Type a message... (Press Enter to send)" 
                    : "Connecting to chat..."
                }
                disabled={!isConnected}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              className="px-6 py-3 bg-[#4169E1] hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          {/* Connection info */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              {isConnected 
                ? `✅ Connected` 
                : "🔄 Connecting to chat service..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}