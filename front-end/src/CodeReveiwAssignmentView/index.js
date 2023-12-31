import React, { useEffect, useRef, useState } from "react";
import ajax from "../Services/fetchService";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserProvider";
import CommentContainer from "../CommentContainer";

const CodeReviewAssignmentView = () => {
    const user = useUser();
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState({
        task: "",
        githubUrl: "",
        number: "",
        status: null,
    });

    const [assignmentStatuses, setAssignmentStatuses] = useState([]);

    const prevAssignmentValue = useRef(assignment);

    function updateAssignment(prop, value) {
        const newAssignment = { ...assignment };
        newAssignment[prop] = value;
        setAssignment(newAssignment);
    }

    function save(status) {
        if (status && assignment.status !== status) {
            updateAssignment("status", status);
        } else {
            persist();
        }
    }

    function persist() {
        ajax(
            `/api/assignments/${assignmentId}`,
            "PUT",
            user.jwt,
            assignment
        ).then((assignmentData) => {
            setAssignment(assignmentData);
        });
    }

    useEffect(() => {
        if (prevAssignmentValue.current.status !== assignment.status) {
            persist();
        }
        prevAssignmentValue.current = assignment;
    }, [assignment]);

    useEffect(() => {
        ajax(`/api/assignments/${assignmentId}`, "GET", user.jwt).then(
            (assignmentData) => {
                if (assignmentData.githubUrl === null)
                    assignmentData.githubUrl = "";
                setAssignment(assignmentData.assignment);
                setAssignmentStatuses(assignmentData.statusEnums);
            }
        );
    }, []);

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
                    <Form.Group as={Row} className="my-3" controlId="githubUrl">
                        <Form.Label column sm="3" md="2">
                            GitHub URL:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="url"
                                readOnly
                                placeholder="https://github.com/username/repo-name"
                                onChange={(e) =>
                                    updateAssignment(
                                        "githubUrl",
                                        e.target.value
                                    )
                                }
                                value={assignment.githubUrl}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="task">
                        <Form.Label column sm="3" md="2">
                            Task number:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="text"
                                readOnly
                                placeholder="example_task_number"
                                onChange={(e) =>
                                    updateAssignment("task", e.target.value)
                                }
                                value={assignment.task.id}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="codeReviewVideoUrl"
                    >
                        <Form.Label column sm="3" md="2">
                            Video Review URL:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="text"
                                placeholder="example_video_url"
                                onChange={(e) =>
                                    updateAssignment(
                                        "codeReviewVideoUrl",
                                        e.target.value
                                    )
                                }
                                value={assignment.codeReviewVideoUrl}
                            />
                        </Col>
                    </Form.Group>

                    <div className="d-flex gap-5">
                        {assignment.status === "Completed" ? (
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() =>
                                    save(assignmentStatuses[2].status)
                                }
                            >
                                Re-Claim
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                onClick={() =>
                                    save(assignmentStatuses[4].status)
                                }
                            >
                                Complete Review
                            </Button>
                        )}

                        {assignment.status === "Needs Update" ? (
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() =>
                                    save(assignmentStatuses[2].status)
                                }
                            >
                                Re-Claim
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                variant="danger"
                                onClick={() =>
                                    save(assignmentStatuses[3].status)
                                }
                            >
                                Reject Assignment
                            </Button>
                        )}

                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back
                        </Button>
                    </div>
                    <CommentContainer assignmentId={assignmentId} />
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default CodeReviewAssignmentView;
