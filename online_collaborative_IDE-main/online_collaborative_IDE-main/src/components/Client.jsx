import React from "react";
import Avatar from "react-avatar";

const Client = ({username}) =>{
    const name = username.split(' ')[0];
    return (
        <div className="client">
            <Avatar name = {username} size = {50} round="14px"></Avatar>
            <span className="username-in-editor"> {name}</span>
        </div>
    );
}

export default Client;