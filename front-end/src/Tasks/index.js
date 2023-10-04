import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import ajax from "../Services/fetchService";

const Tasks = () => {
    const user = useUser();
    const [tasks, setTasks] = useState([]);

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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;
