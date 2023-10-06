import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Container,
    Row,
    Form,
    Overlay,
    Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserProvider";

const Login = () => {
    const user = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.jwt) {
            navigate("/dashboard");
        }
    }, [user.jwt]);

    function sendLoginRequest() {
        const reqBody = {
            username: username,
            password: password,
        };
        fetch("/api/authenticate", {
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(reqBody),
        })
            .then((response) => {
                if (response.status === 200 || response.status === 401)
                    return Promise.all([response.json(), response.headers]);
                else return Promise.reject("Unknow error");
            })
            .then(([body, headers]) => {
                if (JSON.stringify(body) === "{}") {
                    user.setJwt(headers.get("authorization"));
                    navigate("/dashboard");
                } else {
                    if (body.username) {
                        setUsernameError(body.username);
                    }
                    if (body.password) {
                        setPasswordError(body.password);
                    }
                }
            })
            .catch((message) => {});
    }

    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mb-3" controlId="username">
                            <label className="fs-4">Username</label>
                            <Form.Control
                                type="username"
                                controlId="username"
                                size="lg"
                                placeholder="Type in your username"
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                    setUsernameError(null);
                                }}
                                isInvalid={usernameError}
                            />
                            {usernameError ? (
                                <Overlay
                                    target={document.getElementById("username")}
                                    show={usernameError}
                                    placement="right"
                                >
                                    <Tooltip
                                        id="username-tooltip"
                                        style={{
                                            fontSize: "10px",
                                        }}
                                    >
                                        {usernameError}
                                    </Tooltip>
                                </Overlay>
                            ) : (
                                <></>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mb-3" controlId="password">
                            <label className="fs-4">Password</label>
                            <Form.Control
                                controlId="password"
                                type="password"
                                size="lg"
                                placeholder="Type in your password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setPasswordError(null);
                                }}
                                isInvalid={passwordError}
                            />
                            {passwordError ? (
                                <Overlay
                                    target={document.getElementById("password")}
                                    show={passwordError}
                                    placement="right"
                                >
                                    <Tooltip
                                        id="password-tooltip"
                                        style={{
                                            fontSize: "10px",
                                        }}
                                    >
                                        {passwordError}
                                    </Tooltip>
                                </Overlay>
                            ) : (
                                <></>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col
                        md="8"
                        lg="6"
                        className="mt-2 d-flex flex-column gap-5 flex-md-row justify-content-md-between"
                    >
                        <Button
                            id="submit"
                            type="button"
                            onClick={() => sendLoginRequest()}
                        >
                            {" "}
                            Login
                        </Button>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            {" "}
                            Exit
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Login;
