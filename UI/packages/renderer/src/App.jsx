import { useState, useRef, useEffect } from "react";
import './cat.css';
import Chat from "./Chat";
import ChatBox from "./ChatBox";

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Listen for ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <div className="catContainer">
        <div
          className="catButtonContainer"
          onClick={() => {
            setIsVisible(!isVisible);
            // setMessages([])
          }}
        >
          <div
            className="catButton"
            style={{
              backgroundImage: `url(./${isVisible ? ( loading ? "cat_tired.gif ": "cat_listen.png") : "sleeping_cat.gif"})`,
            }}
          ></div>
          <img className="dragIcon" src="./drag.png" />
        </div>

        {isVisible && <Chat setMessages={setMessages} loading={loading} setLoading={setLoading} />}
      </div>

      <div style={{ display: isVisible ? "block" : "none" }}>
        <ChatBox messages={messages} endRef={endRef} />
      </div>
    </div>
  );
}

export default App;
