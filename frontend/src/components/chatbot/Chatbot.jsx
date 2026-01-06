import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchChatMessages, sendMessageToBot } from "../../services/chatApi";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Send, Mic, StopCircle, Sparkles, Bot, User, ArrowLeft, RefreshCw, Shield, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

// Quick starter questions for the user
const QUICK_PROMPTS = [
  { text: "File an FIR online", icon: "👮‍♀️" },
  { text: "Rights against Domestic Violence", icon: "🏠" },
  { text: "Cyber harassment laws", icon: "💻" },
  { text: "Maternity leave rules", icon: "bz" },
];

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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN'; // Indian English
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Show text while speaking

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      // Combine all pieces of text (results) into one string
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setInput(""); // Clear input when starting new recording
      startListening();
    }
  };

  // const { 
  //   transcript, 
  //   listening, 
  //   resetTranscript, 
  //   browserSupportsSpeechRecognition ,
  //   error
  // } = useSpeechRecognition();

  // useEffect(() => {
  // if (error) {
  //   console.error("Speech Recognition Error:", error);
  // }
// }, [error]);

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
            content: "👋 Namaste! I am **Shakti**, your legal friend. \n\nI can help you understand Indian laws, file complaints, or find safety. \n\n**You are safe here.** How can I help you today?",
          }]);
      setChatId(null);
      setIsLoading(false);
      setIsPageLoading(false);
    }
  }, [urlChatId]);

  // // Sync speech transcript to input
  // useEffect(() => {
  //   if (listening) {
  //     setInput(transcript);
  //   }
  // }, [transcript, listening]);

  // if (!browserSupportsSpeechRecognition) {
  //   return(
  //     <div className="flex items-center justify-center h-screen bg-rose-50 text-gray-600">
  //       <p>Your browser does not support speech recognition.</p>
  //     </div>
  //   )
  // }

  const handleSend = async (textOverride = null) => {
    const message = textOverride || input.trim() ;
    if (!message) return;

    if (isListening) stopListening();

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. API Call (Matches your backend: expects { message, chatId })
      const response = await sendMessageToBot(message, chatId);
      
      // 3. Handle Response (Matches your backend: returns { reply, chatId })
      const botReply = response.reply || "I am currently updating my legal database. Please try again in a moment.";
      const newChatId = response.chatId;

      const botMsg = { role: "model", content: botReply };
      setMessages((prev) => [...prev, botMsg]);

      // 4. Update URL if this was a new conversation
      if (newChatId && newChatId !== chatId) {
        setChatId(newChatId);
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
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC] relative overflow-hidden font-sans">

    {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-60 animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-200/40 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000" />
      </div>


      {/* --- Header --- */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {urlChatId && (
            <button 
              onClick={() => navigate('/')} 
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-600 fill-violet-100" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Shakti AI</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              Legal Companion • <span className="text-emerald-600">Online</span>
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
          className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
          title="Start New Chat"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* --- Chat Area --- */ }
        <div className="flex-1 overflow-y-auto py-6 px-4 md:px-20 scroll-smooth z-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="popLayout">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {/* Avatar Icons */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 border 
                  ${msg.role === "user" 
                    ? "bg-pink-600 border-pink-700 text-white" 
                    : "bg-white border-violet-100 text-violet-600"}`}>
                  {msg.role === "user" ? (
                    <User size={14} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-pink-600" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-5 py-3.5 shadow-sm text-[14px] 
                    md:text-[15px]leading-7 relative ${
                    msg.role === "user"
                      ? "bg-pink-600 text-white rounded-2xl rounded-tr-none"
                      : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-none shadow-md"
                  }`}
                >
                  {/* Markdown Renderer for Bot */}
                    {msg.role === "model" ? (
                      <div className="markdown-content space-y-2">
                        <ReactMarkdown 
                          components={{
                            strong: ({node, ...props}) => <span className="font-bold text-violet-700" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="marker:text-violet-400" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
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
            className="flex items-center gap-3 ml-1"
          >
             <div className="w-8 h-8 bg-white border border-violet-100 rounded-full flex items-center justify-center shadow-sm">
                 <Sparkles size={14} className="text-violet-500 animate-spin-slow" />
               </div>
             <div className="bg-white/80 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1.5">
                 {[0, 150, 300].map(delay => (
                   <div key={delay} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                 ))}
               </div>
            </motion.div>
        )}

        {/* Welcome/Empty State Suggestions */}
          {messages.length <= 1 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-2xl mx-auto"
            >
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.text)}
                  className="flex items-center gap-3 p-4 bg-white hover:bg-violet-50 border border-slate-100 hover:border-violet-200 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{prompt.icon}</span>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700">{prompt.text}</span>
                </button>
              ))}
            </motion.div>
          )}

        <div ref={chatEndRef} />
      </div>
      </div>

{/* --- Input Area --- */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 pb-6 z-30">
        <div className="max-w-3xl mx-auto relative">
          <div className={`flex items-end gap-2 bg-slate-50 border transition-all duration-300 rounded-[24px] p-2 pr-3 shadow-inner ${isLoading ? 'opacity-70 pointer-events-none' : 'border-slate-200 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100'}`}>
            
            {/* Input Field */}
        {/* <input
          type="text"
          placeholder={listening ? "Listening..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e)=>e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base"
          disabled={isLoading}
        /> */}
        <textarea
              rows={1}
              placeholder={isListening ? "Listening... Speak now" : "Ask Shakti anything regarding laws..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-base px-4 py-3 resize-none max-h-32 scrollbar-hide"
            />

            {/* Actions */}
        <div className="flex items-center gap-2 pb-1">
        <button
          onClick={handleMicClick}
          className={`p-2.5 rounded-full transition-all ${
                    isListening 
                    ? "bg-red-100 text-red-600 animate-pulse" 
                    : "hover:bg-slate-200 text-slate-500 hover:text-slate-700"
                }`}
              title={isListening ? "Stop Listening" : "Speak"}
        >
        {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
        </button>

        <button 
        className="bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg shadow-violet-200 
                hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all transform"
        onClick={()=>handleSend()} 
        disabled={isLoading}
        >
          <Send size={22} fill="currentColor" />
        </button>
        </div>
        </div>

        <div className="text-center mt-3 flex justify-center items-center gap-4 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
            <span className="flex items-center gap-1"><Shield size={10}/> Private & Confidential</span>
            <span className="flex items-center gap-1"><Scale size={10}/> AI Legal Guide</span>
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
