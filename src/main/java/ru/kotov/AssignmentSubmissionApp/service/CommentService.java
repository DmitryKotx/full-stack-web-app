package ru.kotov.AssignmentSubmissionApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kotov.AssignmentSubmissionApp.dto.CommentDTO;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.Comment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.repository.AssignmentRepository;
import ru.kotov.AssignmentSubmissionApp.repository.CommentRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final AssignmentRepository assignmentRepository;
    public Comment save(CommentDTO commentDTO, User user) {
        Comment comment = new Comment();
        Optional<Assignment> assignment = assignmentRepository.findById(commentDTO.getAssignmentId());

        comment.setAssignment(assignment.orElse(null));
        comment.setText(commentDTO.getText());
        comment.setCreatedBy(user);
        comment.setCreatedDate(LocalDateTime.now());
        return commentRepository.save(comment);
    }
}
