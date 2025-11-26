import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchChatMessages, sendMessageToBot } from "../../services/chatApi";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Send, Mic, StopCircle, Sparkles, Bot, User, ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "model",
      content: "👋 Namaste! I'm Shakti AI — your legal companion. I'm here to help you navigate laws and safety. How can I assist you today?", },
  ]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { user } = useAuth();

  const { 
    transcript, 
    listening, 
    resetTranscript, browserSupportsSpeechRecognition 
  } = useSpeechRecognition();

  const chatEndRef = useRef(null);
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(()=> {
    const loadChat = async(id)=> {
      setIsPageLoading(true);
      try{
      const chat = await fetchChatMessages(id);
      if(chat && chat.messages){
        setMessages(chat.messages.map((msg) =>({
            role: msg.role,
            content: msg.content
        })));
        setChatId(chat._id);
      }
      else{
        setMessages([{ role: 'model', content: "Sorry, I couldn't find that chat." }]);
            setChatId(null);
      }
    }
    catch(error){
        console.error("Failed to load chat", error);
    } finally{
      setIsPageLoading(false);
    }
    };

    if(urlChatId){
      loadChat(urlChatId);
    }
    else{
      setMessages([{
            role: "model",
            content: "👋 Namaste! I'm Shakti AI — your legal companion. I'm here to listen and help you navigate your rights and safety. How can I assist you today?",
          }]);
      setChatId(null);
      setIsLoading(false);
      setIsPageLoading(false);
    }
  }, [urlChatId]);

  // Sync speech transcript to input
  useEffect(() => {
    if (listening) {
      setInput(transcript);
    }
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    return(
      <div className="flex items-center justify-center h-screen bg-rose-50 text-gray-600">
        <p>Your browser does not support speech recognition.</p>
      </div>
    )
  }

  const handleSend = async () => {
    const message = input.trim() || transcript.trim();
    if (!message) return;

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    resetTranscript();
    setIsLoading(true);
/*
    const {reply: botReply, chatId : newChatId} = await sendMessageToBot(message, chatId);
    const botMsg = { role: "model", content: botReply };

    setMessages((prev) => [...prev, botMsg]);
    
    if (newChatId) {
        setChatId(newChatId);
        if(!chatId){
          navigate(`/chat/${newChatId}`);
        }
    }
    setIsLoading(false); */

    try {
      // 2. API Call (Matches your backend: expects { message, chatId })
      const response = await sendMessageToBot(message, chatId);
      
      // 3. Handle Response (Matches your backend: returns { reply, chatId })
      const botReply = response.reply || "I'm having trouble connecting right now. Please try again.";
      const newChatId = response.chatId;

      const botMsg = { role: "model", content: botReply };
      setMessages((prev) => [...prev, botMsg]);

      // 4. Update URL if this was a new conversation
      if (newChatId && newChatId !== chatId) {
        setChatId(newChatId);
        // Soft navigation to update URL without reloading
        navigate(`/chat/${newChatId}`, { replace: true });
      }
    } catch (error) {
      console.error("Error sending message to bot:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "⚠️ Something went wrong. Please check your connection." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if(isPageLoading){
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 relative overflow-hidden font-sans">

    {/* --- Ambient Background Effects --- */}
      <div className="absolute top-[-20%] left-[-20%] w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-pink-300/30 rounded-full filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute top-[-20%] right-[-20%] w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-300/30 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-indigo-300/30 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000" />


      {/* --- Header --- */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/50 px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          {urlChatId && (
            <button 
              onClick={() => navigate('/')} 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2.5 rounded-full shadow-lg shadow-pink-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight leading-tight">
              Shakti AI
            </h1>
            <p className="text-xs text-purple-600 font-medium flex items-center gap-1">
              Your Legal Companion <span className="text-[10px]">🌸</span>
            </p>
          </div>
        </div>

        {/* New Chat Button (Mobile/Desktop) */}
        <button 
          onClick={() => {
             setMessages([{
                role: "model",
                content: "👋 Namaste! I'm Shakti AI. How can I assist you today?",
             }]);
             setChatId(null);
             navigate('/');
          }}
          className="p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-purple-600 transition shadow-sm border border-transparent hover:border-purple-100"
          title="Start New Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* --- Chat Area --- */ }
        <div className="flex-1 overflow-y-auto py-4 px-3 md:px-12 md:py-10 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10}}
              animate={{ opacity: 1, y: 0}}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div className={`flex max-w-[78%] md:max-w-[70%] gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {/* Avatar Icons */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 border 
                  ${msg.role === "user" 
                    ? "bg-indigo-100 border-indigo-200" 
                    : "bg-white border-pink-100"}`}>
                  {msg.role === "user" ? (
                    <User size={16} className="text-indigo-600" />
                  ) : (
                    <Bot size={18} className="text-pink-600" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 shadow-sm text-[14px] 
                    md:text-[15px]leading-relaxed relative ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-white/60 text-gray-800 rounded-2xl rounded-tl-sm shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
                  }`}
                >
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={`min-h-[1.2em] ${line.trim().startsWith('*') || line.trim().startsWith('-') ? 'ml-2' : ''}`}>
                        {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
             <div className="w-8 h-8 bg-white border border-pink-100 rounded-full flex items-center justify-center shadow-sm mt-1">
               <Sparkles size={16} className="text-pink-400 animate-pulse" />
             </div>
             <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 border border-pink-50">
               <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
               <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
               <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
               <span className="text-xs text-gray-400 ml-2 font-medium">Shakti is thinking...</span>
             </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

{/* --- Input Area --- */}
      <div className="bg-gradient-to-t from-white via-white/95 to-transparent pt-3 pb-5 px-3 z-20 bottom-0">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-purple-100 shadow-[0_0_20px_rgba(0,0,0,0.08)] rounded-[2rem] p-1.5 pl-4 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-pink-200 focus-within:border-pink-300">
            
            
            {/* Input Field */}
        <input
          type="text"
          placeholder={listening ? "Listening..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e)=>e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base"
          disabled={isLoading}
        />
        <button
          onClick={() => {
            if (listening) {
                  SpeechRecognition.stopListening();
                } else {
                  resetTranscript();
                  SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
                }
          }}
          className={`p-3 rounded-full transition-all duration-300 ${
                listening
                  ? "bg-red-50 text-red-500 animate-pulse ring-2 ring-red-100"
                  : "text-gray-400 hover:bg-pink-50 hover:text-pink-500"
              }`}
              title={listening ? "Stop Listening" : "Speak"}
        >
        {listening ? <StopCircle size={22} /> : <Mic size={22} />}
        </button>

        <button 
        className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white shadow-md shadow-pink-200 
                hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200"
        onClick={handleSend} 
        disabled={isLoading}
        >
          <Send size={20} className={isLoading ? "opacity-50" : "ml-0.5"} />
        </button>
        </div>
<div className="text-center mt-3">
            <p className="text-[11px] text-gray-400 font-medium">
              🤖 Shakti AI provides guidance, not legal counsel. For emergencies, dial <span className="text-pink-600 font-bold">100</span> or <span className="text-pink-600 font-bold">1091</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
