import React from "react";
import { useUser } from "../UserProvider";
import jwt_decode from "jwt-decode";

const Comment = (props) => {
    const user = useUser();
    const decodeJwt = jwt_decode(user.jwt);
    const { createdBy, text, emitEditComment, emitDeleteComment, id } = props;
    return (
        <div className="comment-bubble">
            <div className="d-flex gap-5" style={{ fontWeight: "bold" }}>
                <div>{createdBy.name}</div>
                {decodeJwt.sub === createdBy.username ? (
                    <>
                        <div
                            onClick={() => emitEditComment(id)}
                            style={{ cursor: "pointer", color: "blue" }}
                        >
                            edit
                        </div>
                        <div
                            onClick={() => emitDeleteComment(id)}
                            style={{ cursor: "pointer", color: "red" }}
                        >
                            delete
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div>{text}</div>
        </div>
    );
};

export default Comment;
