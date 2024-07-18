import React, { useState } from "react";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
    console.log("REACT_APP_BACKEND_URL", process.env.REACT_APP_BACKEND_URL);

    const navigate = useNavigate();
    const [roomID, setroomID] = useState("");
    const [username, setusername] = useState("");

    const createRoom= (e) => {
        e.preventDefault();
        const id = v4();
        console.log(id);
        setroomID(id);
        toast.success("Created a new room",{
            style:{
                border: '2px solid #EF00DE',
                padding: '16px',
                color: 'white',
                background: '#282a36'
            },
            iconTheme: {
                primary: 'green',
                secondary: 'white',
            },
        })
    }
    const joinRoom = () =>{
        if(!roomID || !username){
            toast.error("Room ID and Username is required",{
                style:{
                    border: '2px solid #EF00DE',
                    padding: '16px',
                    color: 'white',
                    background: '#282a36'
                },
                iconTheme: {
                    primary: 'red',
                    secondary: 'white',
                },
            })
            return;
        }
        navigate(`editor/${roomID}`,{
            state: {
                username
            }
        })

    }
    const enterpressed = (e) => {
        if(e.code == "Enter"){
            joinRoom();
        }
    }
    return (
        <div className="homepagewrapper">
            <div className="formwrapper">
                <img src="codev.png" alt="Logo" className="logo"/>
                <h4 className="heading">Enter the Room ID to start collaborating</h4>
                <div className="inputwrapper">
                    <input 
                    type="text" className="inputbox" 
                    value={roomID} placeholder="Room ID" 
                    onChange={(e) => setroomID(e.target.value)}
                    onKeyDown={enterpressed}
                    />
                    <input 
                    type="text" className="inputbox" placeholder="Username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    onKeyDown={enterpressed}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>Join Now</button>

                    <span className="newroom">Don't have a Room ID? &nbsp; 
                        <a href="" onClick= {createRoom} className="createnewBtn">
                            create new room
                        </a>
                    </span>
                    
                </div>
            </div>
            <footer>
                <h4>Built by &nbsp; 
                    <a href="https://www.linkedin.com/in/aadityatripathi/">
                        Aaditya Tripathi
                    </a>
                </h4>
            </footer>
        </div>
    );
}

export default Home;