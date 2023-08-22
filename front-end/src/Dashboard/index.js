import { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [assignments, setAssignments] = useState(null);

    useEffect(() => {
        fetch("/api/assignments", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) return response.json()
            })
            .then((assignmentsData) => {
                setAssignments(assignmentsData);
            });
    }, []);

    function createAssignment() {
        fetch("/api/assignments", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "POST"
        })
            .then((response) => {
                if (response.status === 200) return response.json()
            })
            .then((assignments) => {
                window.location.href = `/assignments/${assignments.id}`;
            });
    }

    return (
        <div style={{ margin: "2em" }}>
            {assignments ? (
                assignments.map((assignments) => (
                    <div>
                        <Link to={`/assignments/${assignments.id}`}>
                            Assignment ID: {assignments.id}
                        </Link>
                    </div>
                ))
            ) : (
                <></>
            )}
            <button onClick={() => createAssignment()}>Submit New Assignment</button>
        </div>
    );
};

export default Dashboard;