import "./App.css";
import Dashboard from "./Dashboard";
import HomePage from "./HomePage";
import jwt_decode from "jwt-decode";
import { Route, Routes } from "react-router-dom";
import PrivateRout from "./PrivateRoute";
import Login from "./Login";
import AssignmentView from "./AssignmentView";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocalState } from "./util/useLocalStorage";
import { useState } from "react";
import CodeReviewerDashboard from "./CodeReviewerDashboard";

function App() {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [roles, setRoles] = useState(getRolesFromJwt());

    function getRolesFromJwt() {
        if (jwt) {
            const decodeJwt = jwt_decode(jwt);
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
                path="/assignments/:id"
                element={
                    <PrivateRout>
                        <AssignmentView />
                    </PrivateRout>
                }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
}

export default App;
