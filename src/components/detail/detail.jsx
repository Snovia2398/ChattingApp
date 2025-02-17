import "./detail.css"
import { auth} from "../../lib/firebase.js";
import { useUserStore } from "../../lib/userStore.js";
import { useChatStore } from "../../lib/chatStore.js";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";

const Detail = () => {

    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();
    const {currentUser} = useUserStore();

    const handleBlock = async ()=>{
        if(!user) return;

        const userDocRef = doc(db, "users", currentUser.id)
       try{
        await updateDoc(userDocRef,{
            blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
        })
        changeBlock();
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div className="detail">
            <div className="user">
                <img className="uimg" src={user?.avatar || "./avatar.png"} alt="" />
                <h2 className="uh">{user?.username}</h2>
                <p className="up">Lorem Ipsum is simply dummy text</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span className="tspan">Chat Settings</span>
                        <img className="timg" src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span className="tspan">Privacy % Help</span>
                        <img className="timg" src="./arrowUp.png" alt="" />
                    </div>
                </div>               
                 <div className="option">
                    <div className="title">
                        <span className="tspan">Shared Photos</span>
                        <img className="timg" src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItms">
                            <div className="photoDetail">
                            <img className="tpimg" src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350" alt="" />
                            <span className="tpspan">photo_2024_2.png</span>
                            </div>
                            <img className="icon" src="./download.png" alt="" />
                        </div>
                        <div className="photoItms">
                            <div className="photoDetail">
                            <img className="tpimg" src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350" alt="" />
                            <span className="tpspan">photo_2024_2.png</span>
                            </div>
                            <img className="icon" src="./download.png" alt="" />
                        </div>
                        <div className="photoItms">
                            <div className="photoDetail">
                            <img className="tpimg" src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350" alt="" />
                            <span className="tpspan">photo_2024_2.png</span>
                            </div>
                            <img className="icon" src="./download.png" alt="" />
                        </div>
                    </div>
                </div>                
                <div className="option">
                    <div className="title">
                        <span className="tspan">Shared Files</span>
                        <img className="timg" src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button className="blkButton" onClick={handleBlock}>
                    {
                    isCurrentUserBlocked?"You are blocked": 
                    isReceiverBlocked? "user blocked" : 
                    "Block User"
                    }
                </button>
                <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
                </div>
        </div>
    )
}

export default Detail