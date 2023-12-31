import "./App.css";
import Dashboard from "./Dashboard";
import HomePage from "./HomePage";
import jwt_decode from "jwt-decode";
import { Route, Routes } from "react-router-dom";
import PrivateRout from "./PrivateRoute";
import AssignmentView from "./AssignmentView";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import CodeReviewerDashboard from "./CodeReviewerDashboard";
import CodeReveiwAssignmentView from "./CodeReveiwAssignmentView";
import { useUser } from "./UserProvider";
import Login from "./Login";
import Register from "./Register";
import AssignmentTasks from "./AssignmentTasks";
import CodeReviewerTasks from "./CodeReviewerTasks";
import TaskView from "./TaskView";

function App() {
    const [roles, setRoles] = useState([]);
    const user = useUser();

    useEffect(() => {
        setRoles(getRolesFromJwt());
    }, [user.jwt]);

    function getRolesFromJwt() {
        if (user.jwt) {
            const decodeJwt = jwt_decode(user.jwt);
            return decodeJwt.authorities;
        }
    }

    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    roles && roles.find((role) => role === "REVIEWER") ? (
                        <PrivateRout>
                            <CodeReviewerDashboard />
                        </PrivateRout>
                    ) : (
                        <PrivateRout>
                            <Dashboard />
                        </PrivateRout>
                    )
                }
            />

            <Route
                path="/assignments/:assignmentId"
                element={
                    roles && roles.find((role) => role === "REVIEWER") ? (
                        <PrivateRout>
                            <CodeReveiwAssignmentView />
                        </PrivateRout>
                    ) : (
                        <PrivateRout>
                            <AssignmentView />
                        </PrivateRout>
                    )
                }
            />

            <Route
                path="/tasks"
                element={
                    roles && roles.find((role) => role === "REVIEWER") ? (
                        <PrivateRout>
                            <CodeReviewerTasks />
                        </PrivateRout>
                    ) : (
                        <PrivateRout>
                            <AssignmentTasks />
                        </PrivateRout>
                    )
                }
            />
            <Route path="/tasks/:taskId" element={<TaskView />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
}

export default App;
