import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';

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
        ajax(`/api/assignments/${id}`, "PUT", jwt, assignment)
            .then((assignmentData) => {
                setAssignment(assignmentData);
            });
    }

    useEffect(() => {
        ajax(`/api/assignments/${id}`, "GET", jwt)
            .then((assignmentData) => {
                if (assignmentData.branch === null) assignmentData.branch = "";
                if (assignmentData.githubUrl === null) assignmentData.githubUrl = "";
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
                            id='githubUrl'
                            onChange={(e) => updateAssignment("githubUrl", e.target.value)}
                            value={assignment.githubUrl} />
                    </h3>
                    <h3>
                        Brahch: {" "}
                        <input
                            type='text'
                            id='branch'
                            onChange={(e) => updateAssignment("branch", e.target.value)}
                            value={assignment.branch} />
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