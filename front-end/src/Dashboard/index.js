import { useEffect, useState } from "react";
import ajax from "../Services/fetchService";
import { Button, Card, Col, Pagination, Row } from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserProvider";

const Dashboard = () => {
    const user = useUser();
    const [assignments, setAssignments] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const assignmentsForPage = fillAssignmentsForPage();
    const pageCount = Math.ceil(assignments.length / itemsPerPage);

    const navigate = useNavigate();

    useEffect(() => {
        ajax("/api/assignments", "GET", user.jwt).then((assignmentsData) => {
            setAssignments(assignmentsData);
        });

        if (!user.jwt) navigate("/login");
    }, [user.jwt]);

    function createAssignment() {
        ajax("/api/assignments", "POST", user.jwt).then((assignments) => {
            navigate(`/assignments/${assignments.id}`);
        });
    }

    function fillAssignmentsForPage() {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return assignments.slice(startIndex, endIndex);
    }
    function setCurrentPage(selectedPage) {
        setPage(selectedPage);
    }

    return (
        <div style={{ margin: "1em" }}>
            <Row>
                <Col>
                    <div
                        className="d-flex justify-content-end"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            user.setJwt(null);
                            navigate("/login");
                        }}
                    >
                        Logout
                    </div>
                </Col>
            </Row>

            <div className="mb-4">
                <Button size="lg" onClick={() => createAssignment()}>
                    Submit New Assignment
                </Button>
            </div>

            {assignmentsForPage ? (
                <div
                    className="d-grid gap-5"
                    style={{
                        marginLeft: "100px",
                        gridTemplateColumns: "repeat(auto-fit, 18rem)",
                    }}
                >
                    {assignmentsForPage.map((assignment) => (
                        <Card key={assignment.id} style={{ width: "18rem" }}>
                            <Card.Body className="d-flex flex-column justify-content-around">
                                <Card.Title>
                                    Assignment #{assignment.number}
                                </Card.Title>
                                <div className="d-flex align-items-start">
                                    <StatusBadge text={assignment.status} />
                                </div>
                                <Card.Text style={{ marginTop: "1em" }}>
                                    <p>
                                        <b>GitHub URL</b>:{" "}
                                        {assignment.githubUrl}
                                    </p>
                                    <p>
                                        <b>Branch</b>: {assignment.branch}
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
                                    Edit
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <></>
            )}
            <div
                style={{
                    position: "fixed",
                    bottom: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <Pagination>
                    {[...Array(pageCount)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === page}
                            onClick={() => setPage(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </div>
    );
};

export default Dashboard;
