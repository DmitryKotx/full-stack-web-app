import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Col,
    Container,
    Form,
    Overlay,
    Row,
    Tooltip,
} from "react-bootstrap";

const Register = () => {
    const user = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [roleError, setRoleError] = useState(null);
    const roles = ["STUDENT", "REVIEWER"];
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        if (user.jwt) {
            navigate("/dashboard");
        }
    }, [user.jwt]);

    function handleOptionChange(event, role) {
        setSelectedOption(event.target.value);
        setRole(role);
    }

    function sendLoginRequest() {
        const reqBody = {
            username: username,
            email: email,
            password: password,
            role: role,
        };

        fetch("/api/register", {
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
                    if (body.email) {
                        setEmailError(body.email);
                    }
                    if (body.username) {
                        setUsernameError(body.username);
                    }
                    if (body.password) {
                        setPasswordError(body.password);
                    }
                    if (body.role) {
                        setRoleError(body.role);
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
                        <Form.Group className="mb-3" controlId="email">
                            <label className="fs-4">Email</label>
                            <Form.Control
                                type="email"
                                controlId="email"
                                size="lg"
                                placeholder="Type in your email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setEmailError(null);
                                }}
                                isInvalid={emailError}
                            />
                            {emailError ? (
                                <Overlay
                                    target={document.getElementById("email")}
                                    show={emailError}
                                    placement="right"
                                >
                                    <Tooltip
                                        id="email-tooltip"
                                        style={{
                                            fontSize: "10px",
                                        }}
                                    >
                                        {emailError}
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
                        className="mt-3 d-flex flex-column gap-5 flex-md-row justify-content-md-between"
                    >
                        <div>
                            <input
                                type="radio"
                                value="option1"
                                checked={selectedOption === "option1"}
                                onChange={(event) => {
                                    handleOptionChange(event, roles[0]);
                                    setRoleError(null);
                                }}
                            />
                            {roles[0]}
                        </div>
                        <h5 id="h5">Choose a role</h5>
                        <Overlay
                            target={document.getElementById("h5")}
                            show={roleError}
                            placement="top"
                        >
                            <Tooltip
                                id="role-tooltip"
                                style={{
                                    fontSize: "10px",
                                }}
                            >
                                {roleError}
                            </Tooltip>
                        </Overlay>
                        <div>
                            <input
                                type="radio"
                                value="option2"
                                checked={selectedOption === "option2"}
                                onChange={(event) => {
                                    handleOptionChange(event, roles[1]);
                                    setRoleError(null);
                                }}
                            />
                            {roles[1]}
                        </div>
                    </Col>
                </Row>{" "}
                <Row className="justify-content-center">
                    <Col
                        md="8"
                        lg="6"
                        className="mt-4 d-flex flex-column gap-5 flex-md-row justify-content-md-between"
                    >
                        <Button
                            id="submit"
                            type="button"
                            onClick={() => sendLoginRequest()}
                        >
                            {" "}
                            Register
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

export default Register;
