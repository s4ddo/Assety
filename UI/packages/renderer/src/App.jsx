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
              className="catButtonContainer"
              onClick={() => {
                setIsVisible(!isVisible);
                // setMessages([])
              }} 
            >
              <div 
              className="catButton"
              style={{
                backgroundImage: `url(./${isVisible ? "cat_listen" : "cat_idle"}.png)`,
              }}></div>
              <img className="dragIcon" src="./drag.png"/>
            </div>


            {isVisible && (
                <Chat setMessages={setMessages}/>
            )}
            

        </div>

        <div style={{display: (isVisible) ? "block" : "none"  }}><ChatBox messages={messages} endRef={endRef}/></div>

    </div>
  );

}

export default App;