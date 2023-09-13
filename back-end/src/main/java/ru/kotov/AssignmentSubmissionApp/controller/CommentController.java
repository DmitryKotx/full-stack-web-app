package ru.kotov.AssignmentSubmissionApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kotov.AssignmentSubmissionApp.dto.CommentDTO;
import ru.kotov.AssignmentSubmissionApp.model.Comment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.service.CommentService;

import java.util.Set;

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

    @PutMapping("{commentId}")
    public ResponseEntity<Comment> updateComment(@RequestBody CommentDTO commentDTO, @AuthenticationPrincipal User user, @PathVariable String commentId) {
        Comment comment = commentService.save(commentDTO, user);
        return ResponseEntity.ok(comment);
    }
    @DeleteMapping("{commentId}")
    public ResponseEntity<Comment> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal User user ) {
        commentService.delete(commentId);
        return ResponseEntity.ok(new Comment());
    }

    @GetMapping("")
    public ResponseEntity<Set<Comment>> getComments(@RequestParam Long assignmentId) {
        Set<Comment> comments = commentService.getCommentsByAssignment(assignmentId);
        return ResponseEntity.ok(comments);
    }
}
