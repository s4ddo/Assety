import { useState } from "react";
import './chat.css'
import './glb-viewer'
import MeshLoaderCanvas from "./glb-viewer";
import MeshCanvas from "./glb-viewer";
import { parseForMesh, parseForAudio, parseMedia } from "./message-parser";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async (e) => {

  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = { sender: "you", text: input };
  const botMessage = { sender: "bot", text: "" };

  setMessages((prev) => [...prev, userMessage, botMessage]);
  setInput("");

  try {
    setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: input };
        return updated;
      });
  } catch (error) {
    console.error("Error streaming:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Error streaming response" },
    ]);
  }
};

return (
  <div>
    <div className="container">
    <div className="chatBox">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`message ${msg.sender === "bot" ? "bot" : ""}`}
          style={{
            alignSelf: msg.sender === "you" ? "flex-end" : "flex-start",
          }}
        >
          {msg.sender === "bot" ? (<div>
            {parseMedia([msg.text])}
            
            </div>
          ) : (
            msg.text
          )}
        </div>
      ))}
    </div>
  </div>
    <form onSubmit={handleSend} className="inputForm">
      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className = "input"
      />
    </form>
  </div>
);

}

export default App;
