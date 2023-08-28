import "./App.css";
import Dashboard from "./Dashboard";
import HomePage from "./HomePage";
import { Route, Routes } from "react-router-dom";
import PrivateRout from "./PrivateRoute";
import Login from "./Login";
import AssignmentView from "./AssignmentView";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    <PrivateRout>
                        <Dashboard />
                    </PrivateRout>
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
