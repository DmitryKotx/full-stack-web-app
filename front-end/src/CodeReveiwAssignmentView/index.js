import React, { useEffect, useRef, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useNavigate } from "react-router-dom";

const CodeReviewAssignmentView = () => {
    const id = window.location.href.split("/assignments/")[1];
    const navigate = useNavigate();
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [assignment, setAssignment] = useState({
        branch: "",
        githubUrl: "",
        number: "",
        status: null,
    });

    const [assignmentEnums, setAssignmentEnums] = useState([]);
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
        ajax(`/api/assignments/${id}`, "PUT", jwt, assignment).then(
            (assignmentData) => {
                setAssignment(assignmentData);
            }
        );
    }

    useEffect(() => {
        if (prevAssignmentValue.current.status !== assignment.status) {
            persist();
        }
        prevAssignmentValue.current = assignment;
    }, [assignment]);

    useEffect(() => {
        ajax(`/api/assignments/${id}`, "GET", jwt).then((assignmentData) => {
            if (assignmentData.branch === null) assignmentData.branch = "";
            if (assignmentData.githubUrl === null)
                assignmentData.githubUrl = "";
            setAssignment(assignmentData.assignment);
            setAssignmentEnums(assignmentData.assignmentEnums);
            setAssignmentStatuses(assignmentData.statusEnums);
        });
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

                    <Form.Group as={Row} className="mb-3" controlId="brahch">
                        <Form.Label column sm="3" md="2">
                            Brahch:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="text"
                                readOnly
                                placeholder="example_branch_name"
                                onChange={(e) =>
                                    updateAssignment("branch", e.target.value)
                                }
                                value={assignment.branch}
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
                                value={assignment.branch}
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
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default CodeReviewAssignmentView;
