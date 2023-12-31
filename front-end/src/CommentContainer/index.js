import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import ajax from "../Services/fetchService";
import { Button, Col, Form, Overlay, Tooltip } from "react-bootstrap";
import Comment from "../Comment";
import { useInterval } from "../util/useInterval";
import dayjs from "dayjs";

const CommentContainer = (props) => {
    const user = useUser();
    const { assignmentId } = props;
    const emptyComment = {
        id: null,
        text: "",
        assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
        user: user.jwt,
        createdDate: null,
    };
    const [textError, setTextError] = useState();
    const [comment, setComment] = useState(emptyComment);
    const [comments, setComments] = useState([]);

    useInterval(() => {
        updateCommentRelativeTime();
    }, 1000 * 5);

    function updateCommentRelativeTime() {
        const commentsCopy = [...comments];
        commentsCopy.forEach(
            (comment) => (comment.createdDate = dayjs(comment.createdDate))
        );
        setComments(commentsCopy);
    }

    function handleEditComment(commentId) {
        const i = comments.findIndex((comment) => comment.id === commentId);
        const commentCopy = {
            id: comments[i].id,
            text: comments[i].text,
            assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
            user: user.jwt,
            createdDate: comments[i].createdDate,
        };
        setComment(commentCopy);
    }
    function handleDeleteComment(commentId) {
        ajax(`/api/comments/${commentId}`, "DELETE", user.jwt).then(() => {
            const commentsCopy = [...comments];
            const i = commentsCopy.findIndex(
                (comment) => comment.id === commentId
            );
            commentsCopy.splice(i, 1);
            setComments(commentsCopy);
        });
    }

    function submitComment() {
        if (comment.id) {
            ajax(`/api/comments/${comment.id}`, "PUT", user.jwt, comment).then(
                (data) => {
                    if (data && data.id) {
                        const commentsCopy = [...comments];
                        const i = comments.findIndex(
                            (comment) => comment.id === data.id
                        );
                        commentsCopy[i] = data;
                        setComments(commentsCopy);
                        setComment(emptyComment);
                    } else {
                        setTextError(data.text);
                    }
                }
            );
        } else {
            ajax("/api/comments", "POST", user.jwt, comment).then((data) => {
                if (data && data.id) {
                    const commentsCopy = [...comments];
                    commentsCopy.push(data);
                    setComments(commentsCopy);
                    setComment(emptyComment);
                } else {
                    setTextError(data.text);
                }
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

    return (
        <>
            <div className="mt-5">
                <Form.Group controlId="text">
                    <Col sm="9" md="8" lg="6">
                        <Form.Control
                            className="mb-3"
                            type="text"
                            controlId="text"
                            placeholder="some text"
                            value={comment.text}
                            onChange={(event) => {
                                updateComment(event.target.value);
                                setTextError(null);
                            }}
                            isInvalid={textError}
                        />
                        {textError ? (
                            <Overlay
                                target={document.getElementById("text")}
                                show={textError}
                                placement="right"
                            >
                                <Tooltip
                                    id="tetx-tooltip"
                                    style={{
                                        fontSize: "10px",
                                    }}
                                >
                                    {textError}
                                </Tooltip>
                            </Overlay>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Form.Group>

                <Button onClick={() => submitComment()}>Post Comment</Button>
            </div>
            <div className="mt-5">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        commentData={comment}
                        emitDeleteComment={handleDeleteComment}
                        emitEditComment={handleEditComment}
                    />
                ))}
            </div>
        </>
    );
};

export default CommentContainer;
