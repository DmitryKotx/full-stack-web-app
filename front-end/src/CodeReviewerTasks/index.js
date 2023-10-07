import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import ajax from "../Services/fetchService";
import { Button } from "react-bootstrap";
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
        <div className="container">
            <h1>Tasks</h1>
            <ul className="list-group">
                {tasks.map((task, index) => (
                    <li key={index} className="list-group-item">
                        Task {task.id}: {task.text}
                        <br />
                        <Button
                            variant="info"
                            onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                            Edit task
                        </Button>
                    </li>
                ))}
            </ul>
            <br />
            <Button onClick={() => addTask()}>Add task</Button>
        </div>
    );
};

export default CodeReviewerTasks;
