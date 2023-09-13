import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const Register = () => {
    const user = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(null);
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
            .then(([body, headers]) => {
                user.setJwt(headers.get("authorization"));
                navigate("/dashboard");
            })
            .catch((message) => {
                alert(message);
            });
    }

    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mb-3" controlId="username">
                            <label className="fs-4">Username</label>
                            <Form.Control
                                type="email"
                                id="username"
                                size="lg"
                                placeholder="Type in your email"
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
                        <Form.Group className="mb-3" controlId="password">
                            <label className="fs-4">Password</label>
                            <Form.Control
                                type="password"
                                id="password"
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

export default Register;
