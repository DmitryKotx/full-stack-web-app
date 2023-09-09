import React, { useEffect, useRef, useState } from "react";
import ajax from "../Services/fetchService";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    Row,
} from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserProvider";
import Comment from "../Comment";

const AssignmentView = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const user = useUser();
    const [assignment, setAssignment] = useState({
        branch: "",
        githubUrl: "",
        number: "",
        status: null,
    });
    const emptyComment = {
        id: null,
        text: "",
        assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
        user: user.jwt,
    };
    const [assignmentEnums, setAssignmentEnums] = useState([]);
    const [assignmentStatuses, setAssignmentStatuses] = useState([]);
    const [comment, setComment] = useState(emptyComment);
    const [comments, setComments] = useState([]);
    const prevAssignmentValue = useRef(assignment);

    function handleDeleteComment(commentId) {
        ajax(`/api/comments/${commentId}`, "DELETE", user.jwt).then(() => {
            const commentsCopy = [...comments];
            const i = commentsCopy.findIndex(
                (comment) => comment.id === commentId
            );
            console.log(commentsCopy);
            commentsCopy.splice(i, 1);
            console.log(commentsCopy);

            setComments(commentsCopy);
        });
    }
    function handleEditComment(commentId) {
        const i = comments.findIndex((comment) => comment.id === commentId);
        const commentCopy = {
            id: comments[i].id,
            text: comments[i].text,
            assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
            user: user.jwt,
        };
        setComment(commentCopy);
    }

    function submitComment() {
        if (comment.id) {
            ajax(`/api/comments/${comment.id}`, "PUT", user.jwt, comment).then(
                (data) => {
                    const commentsCopy = [...comments];
                    const i = comments.findIndex(
                        (comment) => comment.id === data.id
                    );
                    commentsCopy[i] = data;
                    setComments(commentsCopy);
                    setComment(emptyComment);
                }
            );
        } else {
            ajax("/api/comments", "POST", user.jwt, comment).then((data) => {
                const commentsCopy = [...comments];
                commentsCopy.push(data);
                setComments(commentsCopy);
                setComment(emptyComment);
            });
        }
    }
    useEffect(() => {
        ajax(
            `/api/comments?assignmentId=${assignmentId}`,
            "GET",
            user.jwt,
            null
        ).then((commentsData) => {
            setComments(commentsData);
        });
    }, []);

    function updateComment(value) {
        const commentCopy = { ...comment };
        commentCopy.text = value;
        setComment(commentCopy);
    }

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
                if (assignmentData.branch === null) assignmentData.branch = "";
                if (assignmentData.githubUrl === null)
                    assignmentData.githubUrl = "";
                setAssignment(assignmentData.assignment);
                setAssignmentEnums(assignmentData.assignmentEnums);
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
                                    updateAssignment("number", selectedElement);
                                }}
                            >
                                {assignmentEnums.map((assignmentsEnum) => (
                                    <Dropdown.Item
                                        key={assignmentsEnum.number}
                                        eventKey={assignmentsEnum.number}
                                    >
                                        {assignmentsEnum.number}
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
                                placeholder="example_branch_name"
                                onChange={(e) =>
                                    updateAssignment("branch", e.target.value)
                                }
                                value={assignment.branch}
                            />
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
                            <Button size="lg" onClick={() => save("Submitted")}>
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
                                onClick={() => save("Resubmitted")}
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
                    <div className="mt-5">
                        <textarea
                            style={{ width: "100%", borderRadius: "0.25em" }}
                            onChange={(e) => updateComment(e.target.value)}
                            value={comment.text}
                        ></textarea>
                        <Button onClick={() => submitComment()}>
                            Post Comment
                        </Button>
                    </div>
                    <div className="mt-5">
                        {comments.map((comment) => (
                            <Comment
                                createdDate={comment.createdDate}
                                createdBy={comment.createdBy}
                                text={comment.text}
                                emitDeleteComment={handleDeleteComment}
                                emitEditComment={handleEditComment}
                                id={comment.id}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default AssignmentView;
