package ru.kotov.AssignmentSubmissionApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import ru.kotov.AssignmentSubmissionApp.dto.CommentDTO;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.Comment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.repository.AssignmentRepository;
import ru.kotov.AssignmentSubmissionApp.repository.CommentRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final AssignmentRepository assignmentRepository;
    public Comment save(CommentDTO commentDTO, User user, BindingResult bindingResult) {
        if(commentDTO.getText().equals("")) {
            bindingResult.rejectValue("text", "",
                    "The field with the comment text should not be empty");
            return new Comment();
        } else {
            Comment comment = new Comment();
            Optional<Assignment> assignment = assignmentRepository.findById(commentDTO.getAssignmentId());

            comment.setId(commentDTO.getId());
            comment.setAssignment(assignment.orElse(null));
            comment.setText(commentDTO.getText());
            comment.setCreatedBy(user);
            if (comment.getId() == null)
                comment.setCreatedDate(LocalDateTime.now());
            else
                comment.setCreatedDate(commentDTO.getCreatedDate());

            return commentRepository.save(comment);
        }
    }

    public void delete( Long commentId) {
        commentRepository.deleteById(commentId);
    }

    public Set<Comment> getCommentsByAssignment(Long assignmentId) {
        return commentRepository.findByAssignmentId(assignmentId);
    }
    //TODO: add a check for an empty comment
}
