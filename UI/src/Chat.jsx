import { useState, useRef, useEffect} from "react";
import './chat.css'
import './glb-viewer'

function Chat({setMessages}) {
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
  <div className="mainContainer">
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
  </div>
);

}

export default Chat;
