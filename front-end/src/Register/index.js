import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ajax from "../Services/fetchService";

const Register = () => {
    const user = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        if (user.jwt) {
            navigate("/dashboard");
        }
        ajax("/api/roles", "GET", user.jwt).then((roles) => {
            setRoles(roles);
        });
    }, [user.jwt]);

    function handleOptionChange(event, role) {
        setSelectedOption(event.target.value);
        setRole(role);
    }
    function isValidPassword(password) {
        return password.length >= 8 && password.length <= 40;
    }
    function isValidReqBody(reqBody) {
        return (
            reqBody.username !== "" &&
            reqBody.email !== "" &&
            reqBody.role !== ""
        );
    }

    function sendLoginRequest() {
        const reqBody = {
            username: username,
            email: email,
            password: password,
            role: role,
        };
        if (isValidReqBody(reqBody)) {
            if (isValidPassword(password)) {
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
                            return Promise.all([
                                response.json(),
                                response.headers,
                            ]);
                        else
                            return Promise.reject(
                                "Possible errors:\n" +
                                    " 1) The name or email is already taken\n" +
                                    "2) Email is not correct\n"
                            );
                    })
                    .then(([body, headers]) => {
                        if (JSON.stringify(body) === "{}") {
                            user.setJwt(headers.get("authorization"));
                            navigate("/dashboard");
                        } else {
                            alert(body.password);
                        }
                    })
                    .catch((message) => {
                        alert(message);
                    });
            } else {
                alert("The password length must be between 8 and 40!");
                setPassword("");
            }
        } else {
            alert("All fields must be filled in and the role selected!");
        }
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
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                            />
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
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />
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
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
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
                                onChange={(event) =>
                                    handleOptionChange(event, roles[0])
                                }
                            />
                            {roles[0]}
                        </div>
                        <h5>Choose a role</h5>
                        <div>
                            <input
                                type="radio"
                                value="option2"
                                checked={selectedOption === "option2"}
                                onChange={(event) =>
                                    handleOptionChange(event, roles[1])
                                }
                            />
                            {roles[1]}
                        </div>
                    </Col>
                </Row>
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
