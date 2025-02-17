import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore"

const Userinfo = () => {
    const {currentUser} = useUserStore();
    return (
        <div className="userInfo">
            <div className="user">
                <img className="uimg" src={currentUser.avatar || "avatar.png"} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
           <div className="icons">
             <img className="iimg" src="./more.png" alt=""  />
             <img className="iimg" src="./video.png" alt=""  />
             <img className="iimg" src="./edit.png" alt=""  />
            </div> 
            </div>

    )
}

export default Userinfo