import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendMessageToBot } from "../../services/chatApi";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const botReply = await sendMessageToBot(input);
    const botMsg = { sender: "bot", text: botReply };

    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="chat-container" style={styles.container}>
      <div className="chat-box" style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#007bff" : "#e5e5ea",
              color: msg.sender === "user" ? "white" : "black",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Type a message..."
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e)=>e.key === 'Enter' && handleSend()}
        />
        <button style={styles.button} onClick={handleSend}>
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
