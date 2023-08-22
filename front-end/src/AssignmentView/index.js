import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';

const AssignmentView = () => {
    const id = window.location.href.split("/assignments/")[1];

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [assignment, setAssignment] = useState({
        branch: "",
        githubUrl: ""
    });

    function updateAssignment(prop, value) {
        const newAssignment = { ...assignment }
        newAssignment[prop] = value;
        setAssignment(newAssignment);
    }

    function save() {
        fetch(`/api/assignments/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "PUT",
            body: JSON.stringify(assignment)
        })
            .then((response) => {
                if (response.status === 200) return response.json()
            })
            .then((assignmentData) => {
                setAssignment(assignmentData);
            });
    }

    useEffect(() => {
        fetch(`/api/assignments/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) return response.json()
            })
            .then((assignmentData) => {
                setAssignment(assignmentData);
            });
    }, []);

    return (
        <div>
            <h1> Assignment {id}</h1>
            {assignment ? (
                <>
                    <h2>Status: {assignment.status}</h2>
                    <h3>
                        GitHub URL: {" "}
                        <input
                            type='url'
                            id='gitHubUrl'
                            onChange={(e) => updateAssignment("githubUrl", e.target.value)} />
                    </h3>
                    <h3>
                        Brahch: {" "}
                        <input
                            type='text'
                            id='branch'
                            onChange={(e) => updateAssignment("branch", e.target.value)} />
                    </h3>
                    <button onClick={() => save()}>Submit Assignment</button>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default AssignmentView;