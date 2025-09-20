import { useEffect} from "react";
import './chat.css'
import './glb-viewer'
import MeshLoaderCanvas from "./glb-viewer";
import MeshCanvas from "./glb-viewer";
import { parseMedia } from "./message-parser";

export default function ChatBox({messages, endRef}) {

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
    <div>
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

