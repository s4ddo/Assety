import { useState, useRef, useEffect} from "react";
import './chat.css'
import './glb-viewer'
import MeshLoaderCanvas from "./glb-viewer";
import MeshCanvas from "./glb-viewer";
import { parseMedia } from "./message-parser";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  <div className="mainContainer">
    {/* <h1>aiset<span style={{ color: "tomato" }}>.</span></h1> */}

    <form onSubmit={handleSend} className="inputForm">
      <textarea
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // prevent new line
            handleSend(event);      // call your async send function
          }
        }}
        className="input"
        rows={3}
      />
    </form>


    
    {messages.length > 0 && (<div className="container">
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
        <div ref={endRef}></div>
      </div>
    </div>)}



  </div>
);

}

export default Chat;
