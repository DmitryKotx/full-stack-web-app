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
        <>
            {tasks.map((task) => (
                <div>{task.id}</div>
            ))}
        </>
    );
};

export default Tasks;
