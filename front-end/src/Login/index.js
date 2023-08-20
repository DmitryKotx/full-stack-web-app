import React, { useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { func } from 'prop-types';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const [jwt, setJwt] = useLocalState("", "jwt");


    console.log("username is: " + username);
    console.log("password is: " + password);

    function sendLoginRequest() {
        const reqBody = {
            username : username,
            password : password
        }
        fetch("api/authenticate", {
            headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Content-Type': 'application/json',
            },
            method : "post",
            body : JSON.stringify(reqBody)
        })
        .then(response => {
            if(response.status === 200)
                return Promise.all([response.json, response.headers]);
            else return Promise.reject("Invalid login attempt");
        })
        .then(([body, headers]) => {
            setJwt(headers.get("authorization"));
            window.location.href = "dashboard";

        })
        .catch((message) => {
            alert(message);
        });
    }

  

    return (
        <>
            <div>
                <label htmlFor='username'>Username</label>
                <input type='email' id='username' value={username}
                 onChange={(event) => setUsername(event.target.value)}/>
            </div>
            <div>
            <label htmlFor='password'>Password</label>
                <input type='password' id='password'  value={password}
                 onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div>
                <button id='submit' type='button' onClick={() => sendLoginRequest()}>
                    Login
                </button>
            </div>
        </>
    );
};

export default Login;