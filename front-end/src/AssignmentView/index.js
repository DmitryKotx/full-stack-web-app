import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import ajax from '../Services/fetchService';
import { Badge, Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';

const AssignmentView = () => {
    const id = window.location.href.split("/assignments/")[1];

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [assignment, setAssignment] = useState({
        branch: "",
        githubUrl: ""
    });

    const [assignmentsEnums, setAssignmentsEnums] = useState([]);

    function updateAssignment(prop, value) {
        const newAssignment = { ...assignment }
        newAssignment[prop] = value;
        setAssignment(newAssignment);
    }

    function save() {
        ajax(`/api/assignments/${id}`, "PUT", jwt, assignment)
            .then((assignmentData) => {
                setAssignment(assignmentData);
            });
    }

    useEffect(() => {
        ajax(`/api/assignments/${id}`, "GET", jwt)
            .then((assignmentData) => {
                if (assignmentData.branch === null) assignmentData.branch = "";
                if (assignmentData.githubUrl === null) assignmentData.githubUrl = "";
                setAssignment(assignmentData.assignment);
                setAssignmentsEnums(assignmentData.assignmentEnums)
            });
    }, []);

    return (
        <Container className='mt-5'>
            <Row className='d-flex align-items-center'>
                <Col>
                    <h1> Assignment {id}</h1>
                </Col>
                <Col>
                    <Badge pill bg="info" style={{ fontSize: "1em" }}>
                        {assignment.status}
                    </Badge>
                </Col>
            </Row>
            {assignment ? (
                <>
                    <Form.Group as={Row} className="my-3" controlId="formPlaintextPassword">
                        <Form.Label column sm="3" md="2">
                            Assignment Number:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <DropdownButton
                                as={ButtonGroup}
                                id="assignmentName"
                                variant='info'
                                title='Assignment 1'
                            >
                                {assignmentsEnums.map((assignmentsEnum) => (
                                    <Dropdown.Item eventKey={assignmentsEnum.number}>
                                        {assignmentsEnum.number}
                                    </Dropdown.Item>
                                ))}

                            </DropdownButton>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="my-3" controlId="formPlaintextPassword">
                        <Form.Label column sm="3" md="2">
                            GitHub URL:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                id='githubUrl'
                                type="url"
                                placeholder="https://github.com/username/repo-name"
                                onChange={(e) => updateAssignment("githubUrl", e.target.value)}
                                value={assignment.githubUrl}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                        <Form.Label column sm="3" md="2">
                            Brahch:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                id='branch'
                                type="text"
                                placeholder="example_branch_name"
                                onChange={(e) => updateAssignment("branch", e.target.value)}
                                value={assignment.branch}
                            />
                        </Col>
                    </Form.Group>
                    <Button size='lg' onClick={() => save()}>Submit Assignment</Button>
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default AssignmentView;