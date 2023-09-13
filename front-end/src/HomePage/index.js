import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useUser } from "../UserProvider";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const user = useUser();
    const navigate = useNavigate();

    return (
        <div className="center-container">
            <h1>HomePage</h1>
            <div className="button-container mt-4">
                <Button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        user.setJwt(null);
                        navigate("/login");
                    }}
                >
                    Login
                </Button>
                <Button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        user.setJwt(null);
                        navigate("/register");
                    }}
                >
                    Register
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
