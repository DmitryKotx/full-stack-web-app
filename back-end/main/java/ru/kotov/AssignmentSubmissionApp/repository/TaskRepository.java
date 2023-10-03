package ru.kotov.AssignmentSubmissionApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.kotov.AssignmentSubmissionApp.model.Task;
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

}
