import { useState } from "react";
import ReactMarkdown from "react-markdown";
import './chat.css';
import './glb-viewer';

function Chat({ setMessages, loading, setLoading }) {
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return; // prevent sending if loading

    setLoading(true); // lock input

    // show user message immediately
    const userMessage = { sender: "you", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // add bot placeholder with "..."
    const botPlaceholder = { sender: "bot", text: "..." };
    setMessages((prev) => [...prev, botPlaceholder]);

    const currentInput = input;
    setInput(""); // clear input field

    try {
      const response = await fetch("https://horribly-mighty-goshawk.ngrok-free.app/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: currentInput, user_id: "ahmad" }),
      });

      const res = await response.json();
      console.log(res);

      // replace "..." with actual bot reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: res.reply };
        return updated;
      });
    } catch (error) {
      console.error("Error sending text:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: "❌ Error fetching reply" };
        return updated;
      });
    } finally {
      setLoading(false); // unlock input
    }
  };

  return (
    <div className="mainContainer">
      <form onSubmit={handleSend} className="inputForm">
        <textarea
          placeholder={loading ? "Waiting for reply..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (!loading) handleSend(event); // block if loading
            }
          }}
          className="input"
          rows={3}
          disabled={loading} // 🚀 lock while generating
        />
      </form>
    </div>
  );
}

export default Chat;
