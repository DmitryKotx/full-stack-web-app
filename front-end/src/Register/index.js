import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ajax from "../Services/fetchService";

const Register = () => {
    const user = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
            .then((response) => {
                if (response.status === 200)
                    return Promise.all([response.json, response.headers]);
                else
                    return Promise.reject(
                        "Incorrect data is entered or the role is not selected"
                    );
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
                                type="username"
                                controlId="username"
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
                        md="12"
                        lg="4"
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
