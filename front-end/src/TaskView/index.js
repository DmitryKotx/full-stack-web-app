import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ajax from "../Services/fetchService";
import { useUser } from "../UserProvider";
import { useNavigate, useParams } from "react-router-dom";

const TaskView = () => {
    const navigate = useNavigate();
    const user = useUser();
    const { taskId } = useParams();

    const [task, setTask] = useState({
        id: "",
        text: "",
    });

    function updateTask(prop, value) {
        const newTask = { ...task };
        newTask[prop] = value;
        setTask(newTask);
    }
    function saveTask(task) {
        ajax(`/api/tasks/${task.id}`, "PUT", user.jwt, task).then(
            (taskData) => {
                setTask(taskData);
            }
        );
    }
    useEffect(() => {
        ajax(`/api/tasks/${taskId}`, "GET", user.jwt).then((taskData) => {
            setTask(taskData);
        });
    }, []);

    return (
        <Container>
            <Form.Group as={Row} className="my-3" controlId="text">
                <Form.Label column sm="3" md="2">
                    Task text:
                </Form.Label>
                <Col sm="9" md="8" lg="6">
                    <Form.Control
                        type="url"
                        placeholder="some text"
                        onChange={(e) => updateTask("text", e.target.value)}
                        value={task.text}
                        style={{ whiteSpace: "pre-wrap", minHeight: "3em" }}
                    />
                </Col>
            </Form.Group>
            <br />
            <Button
                onClick={() => {
                    saveTask(task);
                    navigate("/tasks");
                }}
            >
                Save task
            </Button>
        </Container>
    );
};

export default TaskView;
