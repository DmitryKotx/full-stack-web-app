import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Container,
    Form,
    Overlay,
    Row,
    Tooltip,
} from "react-bootstrap";
import ajax from "../Services/fetchService";
import { useUser } from "../UserProvider";
import { useNavigate, useParams } from "react-router-dom";

const TaskView = () => {
    const navigate = useNavigate();
    const user = useUser();
    const { taskId } = useParams();
    const [textError, setTextError] = useState();

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
                if (taskData && taskData.id) {
                    setTask(taskData);
                    navigate("/tasks");
                } else {
                    setTextError(taskData.text);
                }
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
            <h2 className="my-4">Edit Task</h2>
            <Form.Group as={Row} controlId="text">
                <Form.Label column sm="3" md="2">
                    Task text:
                </Form.Label>
                <Col sm="9" md="8" lg="6">
                    <Form.Control
                        type="text"
                        placeholder="Enter task text"
                        onChange={(e) => {
                            updateTask("text", e.target.value);
                            setTextError(null);
                        }}
                        value={task.text}
                        style={{ minHeight: "3em" }}
                    />
                    {textError ? (
                        <Overlay
                            target={document.getElementById("text")}
                            show={textError}
                            placement="right"
                        >
                            <Tooltip
                                id="tetx-tooltip"
                                style={{
                                    fontSize: "10px",
                                }}
                            >
                                {textError}
                            </Tooltip>
                        </Overlay>
                    ) : (
                        <></>
                    )}
                </Col>
            </Form.Group>
            <Button
                variant="primary"
                onClick={() => {
                    saveTask(task);
                }}
            >
                Save Task
            </Button>
        </Container>
    );
};

export default TaskView;
