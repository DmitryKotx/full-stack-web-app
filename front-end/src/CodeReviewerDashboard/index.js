import { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import StatusBadge from "../StatusBadge";
import { useNavigate } from "react-router-dom";

const CodeReviewerDashboard = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [assignments, setAssignments] = useState(null);
    const navigate = useNavigate();

    function editReview(assignment) {
        navigate(`/assignments/${assignment.id}`);
    }

    function claimsAssignment(assignment) {
        const decodeJwt = jwt_decode(jwt);
        const user = {
            username: decodeJwt.sub,
        };

        assignment.codeReviewer = user;
        assignment.status = "In Review";
        ajax(`/api/assignments/${assignment.id}`, "PUT", jwt, assignment).then(
            (updatedAssignment) => {
                const assignmentsCopy = [...assignments];
                const index = assignmentsCopy.findIndex(
                    (a) => a.id === assignment.id
                );
                assignmentsCopy[index] = updatedAssignment;
                setAssignments(assignmentsCopy);
            }
        );
    }

    useEffect(() => {
        ajax("/api/assignments", "GET", jwt).then((assignmentsData) => {
            setAssignments(assignmentsData);
        });
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <div
                        className="d-flex justify-content-end"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setJwt(null);
                            navigate("/login");
                        }}
                    >
                        Logout
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="h1" style={{ marginBottom: "1em" }}>
                        REVIEWER
                    </div>
                </Col>
            </Row>

            <div className="assignment-wrapper in-review">
                <div className="assignment-wrapper-title h3 px-2">
                    In Review
                </div>
                {assignments &&
                assignments.filter(
                    (assignment) => assignment.status === "In Review"
                ).length > 0 ? (
                    <div
                        className="d-grid gap-5"
                        style={{
                            gridTemplateColumns: "repeat(auto-fit, 18rem)",
                        }}
                    >
                        {assignments
                            .filter(
                                (assignment) =>
                                    assignment.status === "In Review"
                            )
                            .map((assignment) => (
                                <Card
                                    key={assignment.id}
                                    style={{ width: "18rem" }}
                                >
                                    <Card.Body className="d-flex flex-column justify-content-around">
                                        <Card.Title>
                                            Assignment #{assignment.number}
                                        </Card.Title>
                                        <div className="d-flex align-items-start">
                                            <StatusBadge
                                                text={assignment.status}
                                            />
                                        </div>
                                        <Card.Text style={{ marginTop: "1em" }}>
                                            <p>
                                                <b>GitHub URL</b>:{" "}
                                                {assignment.githubUrl}
                                            </p>
                                            <p>
                                                <b>Branch</b>:{" "}
                                                {assignment.branch}
                                            </p>
                                        </Card.Text>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                editReview(assignment);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <div>No assignments found</div>
                )}
            </div>
            <div className="assignment-wrapper submitted">
                <div className="assignment-wrapper-title h3 px-2">
                    Awaiting Review
                </div>
                {assignments &&
                assignments.filter(
                    (assignment) => assignment.status === "Submitted"
                ).length > 0 ? (
                    <div
                        className="d-grid gap-5"
                        style={{
                            gridTemplateColumns: "repeat(auto-fit, 18rem)",
                        }}
                    >
                        {assignments
                            .filter(
                                (assignment) =>
                                    assignment.status === "Submitted"
                            )
                            .map((assignment) => (
                                <Card
                                    key={assignment.id}
                                    style={{ width: "18rem" }}
                                >
                                    <Card.Body className="d-flex flex-column justify-content-around">
                                        <Card.Title>
                                            Assignment #{assignment.number}
                                        </Card.Title>
                                        <div className="d-flex align-items-start">
                                            <StatusBadge
                                                text={assignment.status}
                                            />
                                        </div>
                                        <Card.Text style={{ marginTop: "1em" }}>
                                            <p>
                                                <b>GitHub URL</b>:{" "}
                                                {assignment.githubUrl}
                                            </p>
                                            <p>
                                                <b>Branch</b>:{" "}
                                                {assignment.branch}
                                            </p>
                                        </Card.Text>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                claimsAssignment(assignment);
                                            }}
                                        >
                                            Claims
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <div>No assignments found</div>
                )}
            </div>
            <div className="assignment-wrapper needs-update">
                <div className="assignment-wrapper-title h3 px-2">
                    Needs Update
                </div>
                {assignments &&
                assignments.filter(
                    (assignment) => assignment.status === "Needs Update"
                ).length > 0 ? (
                    <div
                        className="d-grid gap-5"
                        style={{
                            gridTemplateColumns: "repeat(auto-fit, 18rem)",
                        }}
                    >
                        {assignments
                            .filter(
                                (assignment) =>
                                    assignment.status === "Needs Update"
                            )
                            .map((assignment) => (
                                <Card
                                    key={assignment.id}
                                    style={{ width: "18rem" }}
                                >
                                    <Card.Body className="d-flex flex-column justify-content-around">
                                        <Card.Title>
                                            Assignment #{assignment.number}
                                        </Card.Title>
                                        <div className="d-flex align-items-start">
                                            <StatusBadge
                                                text={assignment.status}
                                            />
                                        </div>
                                        <Card.Text style={{ marginTop: "1em" }}>
                                            <p>
                                                <b>GitHub URL</b>:{" "}
                                                {assignment.githubUrl}
                                            </p>
                                            <p>
                                                <b>Branch</b>:{" "}
                                                {assignment.branch}
                                            </p>
                                        </Card.Text>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                navigate(
                                                    `/assignments/${assignment.id}`
                                                );
                                            }}
                                        >
                                            View
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <div>No assignments found</div>
                )}
            </div>
        </Container>
    );
};

export default CodeReviewerDashboard;
