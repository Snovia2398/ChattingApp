import { useState } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"

const Chat = () => {
    const[open,setOpen]=useState(false)
    const[text,setText]=useState("")

    const handleEmoji=e=>{
        setText((prev)=> prev+e.emoji);
        setOpen(false)
    }
    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img className="img" src="./avatar.png" alt="" />
                    <div className="texts">
                        <span className="span">Jane Doe</span>
                        <p className="p">Lorem Ipsum is simply dummy text</p>
                    </div>
                </div>
                <div className="icons">
                    <img className="icimg" src="./phone.png" alt="" />
                    <img className="icimg" src="./video.png" alt="" />
                    <img className="icimg" src="./info.png" alt="" />
                </div>
            </div>
            <div className="center"></div>
            <div className="bottom">
                <div className="bicons">
                    <img className="img" src="./img.png" alt="" />
                    <img className="img" src="./camera.png" alt="" />
                    <img className="img" src="./mic.png" alt="" />
                </div>
                <input className="input" type="text" placeholder="Type a message..." 
                value={text} 
                onChange={e=>setText(e.target.value)} />
                <div className="emoji">
                <img className="img" src="./emoji.png" alt="" onClick={()=>setOpen((prev)=>!prev)}/>
                <div className="picker">
                <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                </div>
                </div>
                <button className="sendButton">Send</button>
            </div>
        </div>
    )
}

export default Chat