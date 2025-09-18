import { useState, useRef, useEffect} from "react";
import './cat.css'
import Chat from "./Chat";
function App() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
        <div className="catContainer">

            <img 
            onClick={() => setIsVisible(!isVisible)} 
            className="catButton"  
            src={`/${isVisible ? "cat_listen": "cat_idle"}.png`}/>

            {isVisible && (
                <Chat/>
            )}
            
                    


        </div>



    </div>

    


  );

}

export default App;