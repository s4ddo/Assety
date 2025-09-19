import { useState, useRef, useEffect} from "react";
import './cat.css'
import Chat from "./Chat";
import ChatBox from "./ChatBox";
function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  return (
    <div>
        <div className="catContainer">

            <img 
            onClick={() => setIsVisible(!isVisible)} 
            className="catButton"  
            src={`./${isVisible ? "cat_listen": "cat_idle"}.png`}/>

            {isVisible && (
                <Chat setMessages={setMessages}/>
            )}
            

        </div>

        {isVisible && (<ChatBox messages={messages} endRef={endRef}/>)}

    </div>
  );

}

export default App;