import "./userInfo.css"

const Userinfo = () => {
    return (
        <div className="userInfo">
            <div className="user">
                <img className="uimg" src="avatar.png" alt="" />
                <h2>John Doe</h2>
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