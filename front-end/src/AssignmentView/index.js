import React, { useEffect, useRef, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";
import {
    Badge,
    Button,
    ButtonGroup,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    Row,
} from "react-bootstrap";

const AssignmentView = () => {
    const id = window.location.href.split("/assignments/")[1];

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

    function save() {
        if (assignment.status === assignmentStatuses[0].status) {
            updateAssignment("status", assignmentStatuses[1].status);
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
                    <Badge pill bg="info" style={{ fontSize: "1em" }}>
                        {assignment.status}
                    </Badge>
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

                    <div className="d-flex gap-5">
                        <Button size="lg" onClick={() => save()}>
                            Submit Assignment
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() =>
                                (window.location.href = "/dashboard")
                            }
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

export default AssignmentView;