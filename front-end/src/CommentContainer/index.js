import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import ajax from "../Services/fetchService";
import { Button } from "react-bootstrap";
import Comment from "../Comment";

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
    const [comment, setComment] = useState(emptyComment);
    const [comments, setComments] = useState([]);

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
            console.log(commentsCopy);
            commentsCopy.splice(i, 1);
            console.log(commentsCopy);

            setComments(commentsCopy);
        });
    }

    function submitComment() {
        if (comment.text !== "") {
            if (comment.id) {
                ajax(
                    `/api/comments/${comment.id}`,
                    "PUT",
                    user.jwt,
                    comment
                ).then((data) => {
                    const commentsCopy = [...comments];
                    const i = comments.findIndex(
                        (comment) => comment.id === data.id
                    );
                    commentsCopy[i] = data;
                    setComments(commentsCopy);
                    setComment(emptyComment);
                });
            } else {
                ajax("/api/comments", "POST", user.jwt, comment).then(
                    (data) => {
                        const commentsCopy = [...comments];
                        commentsCopy.push(data);
                        setComments(commentsCopy);
                        setComment(emptyComment);
                    }
                );
            }
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
                <textarea
                    style={{ width: "100%", borderRadius: "0.25em" }}
                    onChange={(e) => updateComment(e.target.value)}
                    value={comment.text}
                ></textarea>
                <Button onClick={() => submitComment()}>Post Comment</Button>
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
    );
};

export default CommentContainer;
