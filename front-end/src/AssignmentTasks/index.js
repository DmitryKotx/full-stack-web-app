import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import ajax from "../Services/fetchService";
import { Container, ListGroup } from "react-bootstrap";

const AssignmentTasks = () => {
    const user = useUser();
    const [tasks, setTasks] = useState([]);

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
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default AssignmentTasks;
