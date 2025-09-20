import { useEffect} from "react";
import './chat.css'
import './glb-viewer'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { parseMedia } from "./message-parser";
import ReactMarkdown from "react-markdown";
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
                    <img className="catIcon" src="./cat_tired.gif"></img>
                        {parseMedia([msg.text]).map((chunk, i) => (
                        typeof chunk === "string" ? (
                            
                                <ReactMarkdown
                                    key={i}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                            style={cb}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                            >
                                            {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                            {children}
                                            </code>
                                        );
                                        },
                                    }}
                                    >
                                    {chunk}
                                    </ReactMarkdown>
                        ) : (
                            <div key={i}>{chunk}</div>
                        )
                        ))}                
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

