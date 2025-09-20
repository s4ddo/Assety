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

            <div 
              onClick={() => {
                setIsVisible(!isVisible);
                setMessages([]);
              }} 
              className="catButton"
              style={{
                backgroundImage: `url(./${isVisible ? "cat_listen" : "cat_idle"}.png)`,
              }}
            >
              <img className="dragIcon" src="./drag.png"/>
            </div>


            {isVisible && (
                <Chat setMessages={setMessages}/>
            )}
            

        </div>

        {isVisible && (<ChatBox messages={messages} endRef={endRef}/>)}

    </div>
  );

}

export default App;