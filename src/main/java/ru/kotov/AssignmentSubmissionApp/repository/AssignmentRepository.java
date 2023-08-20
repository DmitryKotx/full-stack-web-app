package ru.kotov.AssignmentSubmissionApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}
