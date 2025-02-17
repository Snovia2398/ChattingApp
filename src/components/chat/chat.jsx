import { useEffect, useRef, useState } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { create } from "zustand";
import upload from "../../lib/upload";

const Chat = () => {
    const[open,setOpen]=useState(false);
    const[text,setText]=useState("");
    const[chat,setChat]=useState();
    const[img,setImg]=useState({
        file:null,
        url:"",
        
    });

    const {chatId, user,isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
    const {currentUser} = useUserStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);
    
    useEffect(() => {
        const unsub= onSnapshot(doc(db,"chats",chatId), (res)=>{
            setChat(res.data())
        })

        return()=>{
            unsub()
        } 
    }, [chatId]);

    console.log(chat);

    const handleEmoji=e=>{
        setText((prev)=> prev+e.emoji);
        setOpen(false)
    }

    const handleImg=e=>{
        if(e.target.files[0]){
            setImg({
                file: e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleSend = async () =>{
        if (text==="") return;

        let imgUrl = null;

        try{

            if(img.file){
                imgUrl = await upload(img.file)
            }
            await updateDoc(doc(db,"chats",chatId),{
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && {img : imgUrl})
                })
            })

            const userIds= [currentUser.id, user.id]

            userIds.forEach(async (id)=>{
                const userChatsRef = doc(db,"userchats", id)
                const userChatsSnapshot = await getDoc(userChatsRef)
    
                if (userChatsSnapshot.exists()){
                    const userChatsData = userChatsSnapshot.data()
    
                    const chatIndex= userChatsData.chats.findIndex(c=>c.chatId===chatId)
    
                    userChatsData.chats[chatIndex].lastMessage = text
                    userChatsData.chats[chatIndex].inSeen = id === currentUser.id ? true : false
                    userChatsData.chats[chatIndex].updatedAt = Date.now()
    
                    await updateDoc(userChatsRef,{
                        chats: userChatsData.chats
                    })
    
                }
            })
        }catch(err){
            console.log(err)
        }

        setImg({
            file: null,
            url: ""
        })
        setText("")
    }

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img className="img" src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span className="span">{user?.username}</span>
                        <p className="p">Lorem Ipsum is simply dummy text</p>
                    </div>
                </div>
                <div className="icons">
                    <img className="icimg" src="./phone.png" alt="" />
                    <img className="icimg" src="./video.png" alt="" />
                    <img className="icimg" src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {
                    chat?.messages?.map(message=>(
                        <div className={message.senderId===currentUser?.id? "message own" : "message"} key={message?.createAt}>
                         <div className="texts1">
                             {message.img && <img className="img1" src={message.img} />}
                             {<p className="p1">{message.text}</p>}
                             {/* <span className="span1">1 min ago</span> */}
                         </div>
                     </div>
                    ))}
               {img.url && (<div className="message own">
                   <div className="texts">
                    <img src= {img.url} alt=""/>
                   </div>
                </div>
               )}
               <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="bicons">
                    <label htmlFor="file">
                    <img className="img" src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{display:"none"}} onChange={handleImg}/>
                    <img className="img" src="./camera.png" alt="" />
                    <img className="img" src="./mic.png" alt="" />
                </div>
                <input className="input" type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked)? "You cannot send a message" : "Type a message..."} 
                value={text} 
                onChange={e=>setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
                <div className="emoji">
                <img className="img" src="./emoji.png" alt="" onClick={()=>setOpen((prev)=>!prev)}/>
                <div className="picker">
                <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                </div>
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}

export default Chat