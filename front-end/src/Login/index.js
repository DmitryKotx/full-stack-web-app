import React, { useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const [jwt, setJwt] = useLocalState("", "jwt");


    console.log("username is: " + username);
    console.log("password is: " + password);

    function sendLoginRequest() {
        const reqBody = {
            username: username,
            password: password
        }
        fetch("/api/authenticate", {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(reqBody)
        })
            .then(response => {
                if (response.status === 200)
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
            <Container className='mt-5'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label htmlFor='username' className='fs-4'>Username</label>
                    <Form.Control
                        type='email'
                        id='username'
                        size='lg'
                        placeholder='Type in your email'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label htmlFor='password' className='fs-4'>Password</label>
                    <Form.Control
                        type='password'
                        id='password'
                        size='lg'
                        placeholder='Type in your password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>
                <Row>
                    <Col className='mt-2'>
                        <div>
                            <Button id='submit' type='button' onClick={() => sendLoginRequest()}>
                                Login
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Login;