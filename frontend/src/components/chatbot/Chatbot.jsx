import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchChatMessages, sendMessageToBot } from "../../services/chatApi";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layouts/Loader";


const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { user } = useAuth();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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
    <div className="chat-container" style={styles.container}>
      <div className="chat-box" style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#007bff" : "#e5e5ea",
              color: msg.role === "user" ? "white" : "black",
            }}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{...styles.message, alignSelf: 'flex-start', backgroundColor: '#e5e5ea', color: 'black'}}>
            ...
          </div>
        )}
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Type a message..."
          style={styles.input}
          value={input || transcript}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e)=>e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button
          style={{
            ...styles.button,
            backgroundColor: listening ? "#dc3545" : "#28a745",
          }}
          onClick={() =>
            listening
              ? SpeechRecognition.stopListening()
              : SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
          }
          disabled={isLoading}
        >
          {listening ? "🛑 Stop" : "🎙️ Speak"}
        </button>

        <button style={styles.button} onClick={handleSend} disabled={isLoading}>
          Send
        </button>

      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f8fa",
  },
  chatBox: {
    width: "90%",
    maxWidth: "600px",
    height: "70vh",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  message: {
    margin: "8px",
    padding: "10px 15px",
    borderRadius: "20px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  inputBox: {
    width: "90%",
    maxWidth: "600px",
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};

export default Chatbot;
