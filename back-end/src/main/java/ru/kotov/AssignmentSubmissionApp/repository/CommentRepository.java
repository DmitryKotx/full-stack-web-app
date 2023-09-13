package ru.kotov.AssignmentSubmissionApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.kotov.AssignmentSubmissionApp.model.Comment;

import java.util.Set;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("select c from Comment c where c.assignment.Id = :assignmentId")
    Set<Comment> findByAssignmentId(Long assignmentId);
}
