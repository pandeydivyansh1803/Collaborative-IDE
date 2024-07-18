import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../../socket";
import {ACTIONS} from "../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";


const Editorpage = () => {
    const [clients, setClients] = useState([])

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    useEffect(()=>{
        const init = async()=>{
            socketRef.current = await initSocket();
            socketRef.current.on("connect_error", (err)=> handleErrors(err));
            socketRef.current.on("connect_failed", (err)=> handleErrors(err));

            function handleErrors(err){
                console.log("socket error", err);
                toast.error("Socket connection failed, try again later");
                reactNavigator('/');
            }


            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username
            })

            // listening for joined event
            socketRef.current.on(ACTIONS.JOINED,
            ({ clients, username, socketId }) => {
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room`,{
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
                    });
                    console.log(`${username} joined`);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId

                });
            });

            //listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({socketId, username}) => {
                    toast.success(`${username} left the room`,{
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
                    });
                    setClients((prev) => {
                        return prev.filter((client) => client.socketId != socketId);
                    })
                }
            )
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    },[]);

    async function copyRoomId(){
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied to your clipboard",{
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
        }catch(err){
            toast.error("Could not copy the room ID",{
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
            console.log(err);
        }
    }

    function leaveRoom(){
        reactNavigator('/');
    }

    if(!location.state){
        return <Navigate to="/"/>;  
    }

    return (
        <div className="mainwrapper">
            <div className="sidepanel">
                <div className="sidepanel-inner">
                    <div className="logo2">
                        <img src="/codev.png" 
                        className="logo2img" 
                        alt="logo" 
                        />
                    </div>
                    <h3>Connected:</h3>
                    <div className="clientList">
                        {clients.map((client) => (
                            <Client 
                                key = {client.socketId}
                                username = {client.username}>
                            </Client>
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>Copy Room ID</button>
                <button className="btn leaveBtn" onClick={leaveRoom}>Leave Room</button>
            </div>
            <div className="editorwrapper">
                <Editor 
                socketRef = {socketRef}
                roomId = {roomId}
                onCodeChange = {(code) => {codeRef.current = code}}>
                </Editor>
            </div>
        </div>
    );
}

export default Editorpage;