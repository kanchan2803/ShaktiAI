import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchChatMessages, sendMessageToBot } from "../../services/chatApi";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Send, Mic, Loader2, Bot, User } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I'm Shakti AI — your legal companion. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { user } = useAuth();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const chatEndRef = useRef(null);

  useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();

  useEffect(()=> {
    const loadChat = async(id)=> {
      setIsPageLoading(true);
      const chat = await fetchChatMessages(id);
      if(chat){
        setMessages(chat.messages.map(msg =>({
            role: msg.role,
            content: msg.content
        })));
        setChatId(chat._id);
      }
      else{
        setMessages([{ role: 'model', content: "Sorry, I couldn't find that chat." }]);
            setChatId(null);
      }
      setIsPageLoading(false);
    };

    if(urlChatId){
      loadChat(urlChatId);
    }
    else{
      setMessages([]);
      setChatId(null);
      setIsLoading(false);
      setIsPageLoading(false);
    }
  }, [urlChatId]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleSend = async () => {
    const message = input.trim() || transcript.trim();
    if (!message) return;

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    resetTranscript();
    setIsLoading(true);

    const {reply: botReply, chatId : newChatId} = await sendMessageToBot(message, chatId);
    const botMsg = { role: "model", content: botReply };

    setMessages((prev) => [...prev, botMsg]);
    
    if (newChatId) {
        setChatId(newChatId);
        if(!chatId){
          navigate(`/chat/${newChatId}`);
        }
    }
    setIsLoading(false);
  };

  if(isPageLoading){
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          💬 Shakti AI Legal Chatbot
        </h1>
        <div className="h-[400px] overflow-y-auto p-3 bg-white rounded-xl shadow-inner space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}  
          >
            {msg.sender === "bot" && (
                <Bot className="w-6 h-6 text-indigo-600 mt-1 mr-2" />
              )}
              <div
                className={`p-3 rounded-2xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
            {msg.content}
            </div>
              {msg.sender === "user" && (
                <User className="w-6 h-6 text-indigo-600 mt-1 ml-2" />
              )}
            </div>
        ))}
        <div ref={chatEndRef} />

        {isLoading && (
          <div className="flex justify-start items-center text-gray-500">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Typing...
          </div>
        )}
      </div>

      <div className="flex mt-4 space-x-2">
        <input
          type="text"
          placeholder="Type a message or speak..."
          value={input || transcript}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e)=>e.key === 'Enter' && handleSend()}
          className="flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={isLoading}
        />
        <button
          onClick={() =>
            listening
              ? SpeechRecognition.stopListening()
              : SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
          }
          className={`${
              listening ? "bg-pink-500" : "bg-green-500"
            } hover:opacity-90 text-white p-3 rounded-xl transition`}
          disabled={isLoading}
        >
          {listening ? "🛑 Stop" : "🎙️ Speak"}
          <Mic size={20} />
        </button>

        <button 
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition"
        onClick={handleSend} 
        disabled={isLoading}>
          <Send size={20} />
        </button>

      </div>
    </div>
    </div>
  );
};

export default Chatbot;
