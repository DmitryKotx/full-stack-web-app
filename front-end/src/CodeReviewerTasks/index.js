import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import ajax from "../Services/fetchService";
import { Button, Container, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CodeReviewerTasks = () => {
    const navigate = useNavigate();
    const user = useUser();
    const [tasks, setTasks] = useState([]);

    function addTask() {
        ajax("/api/tasks", "POST", user.jwt).then((task) => {
            navigate(`/tasks/${task.id}`);
        });
    }

    useEffect(() => {
        ajax("/api/tasks", "GET", user.jwt).then((tasksList) => {
            setTasks(tasksList);
        });
    }, [user.jwt]);

    return (
        <Container className="mt-4 mb-4">
            <h1>Tasks</h1>
            <ListGroup>
                {tasks.map((task) => (
                    <ListGroup.Item key={task.id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="task-text">
                                Task {task.id}: {task.text}
                            </span>
                            <Button
                                variant="info"
                                onClick={() => navigate(`/tasks/${task.id}`)}
                            >
                                Edit Task
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <div className="mt-3">
                <Button onClick={() => addTask()}>Add Task</Button>
            </div>
        </Container>
    );
};

export default CodeReviewerTasks;
