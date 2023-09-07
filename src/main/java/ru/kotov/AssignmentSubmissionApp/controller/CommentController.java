package ru.kotov.AssignmentSubmissionApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kotov.AssignmentSubmissionApp.dto.CommentDTO;
import ru.kotov.AssignmentSubmissionApp.model.Comment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.service.CommentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    @PostMapping("")
    public ResponseEntity<Comment> createComment(@RequestBody CommentDTO commentDTO, @AuthenticationPrincipal User user) {
        Comment comment = commentService.save(commentDTO, user);
        return ResponseEntity.ok(comment);
    }
}
