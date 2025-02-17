import { useState } from "react"
import "./Login.css"
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase.js";
import { doc, setDoc } from "firebase/firestore"; 
import upload from "../../lib/upload.js";

const Login = () => {
    const[avatar,setAvatar]= useState({
        file: null,
        url: ""
    });

    const [loading, setLoading] = useState (false)
    const handleAvatar=e=>{
        if(e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister= async (e)=>{
        e.preventDefault();
        setLoading(true)
        const formData= new FormData(e.target);
        const {username, email, password} = Object.fromEntries(formData);
        console.log(username);
        console.log(email);
        console.log(password);

        try{
            const res= await createUserWithEmailAndPassword(auth, email, password)
            const imgURL = await upload(avatar.file);
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgURL,
                id: res.user.uid,
                blocked: []
              });

              console.log("User data written to Firestore:", { username, email, avatar: imgURL });

              await setDoc(doc(db, "userchats", res.user.uid), {
                chats: []
              });

            console.log(res);  // You can log the user credential or handle it further as needed
            toast.success("Account created. You can login now!");
            
        }catch(err){
            console.error(err);
        if (err.code === "auth/email-already-in-use") {
            toast.error("Email is already in use. Please try logging in.");
        } else {
            toast.error(err.message);
        }
        } finally{
            setLoading(false);
        }
    };

    const handleLogin= async (e)=>{
        e.preventDefault()
        setLoading(true);

        const formData= new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);

        try{

            await signInWithEmailAndPassword(auth, email, password);
        }catch(err){
            console.log(err)
            toast.error(err.message)
        }
        finally{
            setLoading(false)
        }
       // toast.success("Hello")
    };

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome Back,</h2>
                <form className="form" onSubmit={handleLogin}>
                    <input className="input" type="text" placeholder="Email" name="email"/>
                    <input className="input" type="password" placeholder="Password" name="password"/>
                    <button className="button" disabled={loading}>{loading? "Loading": "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
            <h2>Create an Account</h2>
                <form className="form" onSubmit={handleRegister}>
                    <label className="label" htmlFor="file">
                        <img className="img" src= {avatar.url || "./avatar.png"} alt="" />
                        Upload and Image</label>
                    <input className="input" type="file"id="file" style={{display:"none"}} onChange={handleAvatar}/>
                    <input className="input" type="text" placeholder="Username" name="username"/>
                    <input className="input" type="text" placeholder="Email" name="email"/>
                    <input className="input" type="password" placeholder="Password" name="password"/>
                    <button className="button" disabled={loading}> {loading? "Loading": "Sign Up"}</button>
                </form>
            </div>

        </div>
    )
}

export default Login