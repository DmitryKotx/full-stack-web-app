import React, { useEffect, useState } from "react";
import ajax from "../Services/fetchService";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    Overlay,
    Row,
    Tooltip,
} from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserProvider";
import CommentContainer from "../CommentContainer";

const AssignmentView = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const user = useUser();
    const [taskError, setTaskError] = useState();
    const [githubUrlError, setGithubUrlError] = useState();
    const [task, setTask] = useState({
        id: null,
        text: null,
    });
    const [assignment, setAssignment] = useState({
        githubUrl: "",
        task,
        number: null,
        status: null,
    });
    const [tasks, setTasks] = useState([]);

    const [assignments, setAssignments] = useState([]);

    function updateAssignment(prop, value) {
        const newAssignment = { ...assignment };
        newAssignment[prop] = value;
        setAssignment(newAssignment);
    }

    function save(prevStatus) {
        ajax(
            `/api/assignments/${assignmentId}`,
            "PUT",
            user.jwt,
            assignment
        ).then((assignmentData) => {
            if (assignmentData && assignmentData.id) {
                setAssignment(assignmentData);
            } else {
                setTaskError(assignmentData.task);
                setGithubUrlError(assignmentData.githubUrl);
                updateAssignment("status", prevStatus);
            }
        });
    }

    useEffect(() => {
        ajax(`/api/assignments/${assignmentId}`, "GET", user.jwt).then(
            (assignmentData) => {
                if (assignmentData.githubUrl === null)
                    assignmentData.githubUrl = "";
                setAssignment(assignmentData.assignment);
                setTask(assignmentData.assignment.task);
            }
        );
        ajax("/api/assignments?username=null", "GET", user.jwt).then(
            (assignmentsData) => {
                setAssignments(assignmentsData);
            }
        );
        ajax("/api/tasks", "GET", user.jwt).then((tasksList) => {
            setTasks(tasksList);
        });
    }, []);
    useEffect(() => {
        updateAssignment("task", task);
    }, [task]);

    return (
        <Container className="mt-5">
            <Row className="d-flex align-items-center">
                <Col>
                    {assignment.number && (
                        <h1> Assignment {assignment.number} </h1>
                    )}
                </Col>
                <Col>
                    <StatusBadge text={assignment.status} />
                </Col>
            </Row>
            {assignment ? (
                <>
                    <Form.Group as={Row} className="my-3" controlId="number">
                        <Form.Label column sm="3" md="2">
                            Assignment Number:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <DropdownButton
                                as={ButtonGroup}
                                variant="info"
                                title={
                                    assignment.number
                                        ? `Assignment ${assignment.number}`
                                        : "Select an Assignment"
                                }
                                onSelect={(selectedElement) => {
                                    window.location.href = `/assignments/${
                                        assignments[selectedElement - 1].id
                                    }`;
                                }}
                            >
                                {assignments.map((assignment) => (
                                    <Dropdown.Item
                                        key={assignment.number}
                                        eventKey={assignment.number}
                                    >
                                        {assignment.number}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="my-3" controlId="githubUrl">
                        <Form.Label column sm="3" md="2">
                            GitHub URL:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="url"
                                placeholder="https://github.com/username/repo-name"
                                onChange={(e) => {
                                    updateAssignment(
                                        "githubUrl",
                                        e.target.value
                                    );
                                    setGithubUrlError(null);
                                }}
                                isInvalid={githubUrlError}
                                value={assignment.githubUrl}
                            />
                            {githubUrlError ? (
                                <Overlay
                                    target={document.getElementById(
                                        "githubUrl"
                                    )}
                                    show={githubUrlError}
                                    placement="right"
                                >
                                    <Tooltip
                                        id="githubUrl"
                                        style={{
                                            fontSize: "10px",
                                        }}
                                    >
                                        {githubUrlError}
                                    </Tooltip>
                                </Overlay>
                            ) : (
                                <></>
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="task">
                        <Form.Label column sm="3" md="2">
                            Task number:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <DropdownButton
                                className={taskError ? "error-dropdown" : ""}
                                as={ButtonGroup}
                                variant="light"
                                title={
                                    task ? `Task ${task.id}` : "Select a task"
                                }
                                onSelect={(selectedElement) => {
                                    const temp = tasks[selectedElement - 1];
                                    setTask(temp);
                                    setTaskError(null);
                                }}
                            >
                                {tasks.map((task) => (
                                    <Dropdown.Item
                                        key={task.id}
                                        eventKey={task.id}
                                    >
                                        {task.id}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                    </Form.Group>

                    {assignment.status === "Completed" ? (
                        <>
                            <Form.Group
                                as={Row}
                                className="d-flex align-items-center mb-3"
                                controlId="codeReviewVideoUrl"
                            >
                                <Form.Label column sm="3" md="2">
                                    Code Review Video URL:
                                </Form.Label>
                                <Col sm="9" md="8" lg="6">
                                    <a
                                        href={assignment.codeReviewVideoUrl}
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {assignment.codeReviewVideoUrl}
                                    </a>
                                </Col>
                            </Form.Group>
                            <div className="d-flex gap-5">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Back
                                </Button>
                            </div>
                        </>
                    ) : assignment.status === "Pending Submission" ? (
                        <div className="d-flex gap-5">
                            <Button
                                size="lg"
                                onClick={() => {
                                    const prevStatus = assignment.status;
                                    assignment.status = "Submitted";
                                    save(prevStatus);
                                }}
                            >
                                Submit Assignment
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => navigate("/dashboard")}
                            >
                                Back
                            </Button>
                        </div>
                    ) : (
                        <div className="d-flex gap-5">
                            <Button
                                size="lg"
                                onClick={() => {
                                    const prevStatus = assignment.status;
                                    assignment.status = "Resubmitted";
                                    save(prevStatus);
                                }}
                            >
                                Resubmit Assignment
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => navigate("/dashboard")}
                            >
                                Back
                            </Button>
                        </div>
                    )}
                    <CommentContainer assignmentId={assignmentId} />
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default AssignmentView;
