import "./addUser.css"
import { db } from "../../../lib/firebase"
import { arrayUnion, collection, getDocs, query, QuerySnapshot, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
import { doc } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore"

const AddUser = () =>{
    
    const [user,setUser] = useState(null)
    const { currentUser } = useUserStore();

    const handleSearch = async e => {

        e.preventDefault()
        const formData= new FormData(e.target)
        const username= formData.get("username")

        try{
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));

            const querySnapShot = await getDocs(q)
            if (!querySnapShot.empty){
                setUser(querySnapShot.docs[0].data())
            }
        }catch(err){
            console.log(err)
        }
    }

    const handleAdd = async () =>{

        const chatRef= collection (db, "chats")
        const userChatsRef= collection (db, "userchats")

        try{

            const newChatRef= doc(chatRef)

            await setDoc(newChatRef,{
                createdAt: serverTimestamp(),
                messages: [],
            })

            await updateDoc(doc(userChatsRef,user.id),{
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage:"",
                    receiverId:currentUser.id,
                    updatedAt: Date.now()
                }),
            })
            await updateDoc(doc(userChatsRef,currentUser.id),{
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage:"",
                    receiverId:user.id,
                    updatedAt: Date.now()
                }),
            })
        }catch(err){
            console.log(err)
        }
    }



    return(
        <div className="addUser">
            <form className="addUsrForm" onSubmit={handleSearch}>
                <input className="addUsrInput" type="text" placeholder="Username" name="username"/>
                <button className="addUsrSearch">Search</button>
            </form>
            {user && <div className="usr">
                <div className="detail">
                    <img className="addUsrImg" src={user.avatar || "./avatar.png"} alt="" />
                    <span className="addUsrSpan">Jone Doe</span>
                </div>
                <button className="addUsr" onClick={handleAdd}>{user.username}</button>
            </div>}
        </div>
    )
}

export default AddUser