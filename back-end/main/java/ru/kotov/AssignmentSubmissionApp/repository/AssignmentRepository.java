package ru.kotov.AssignmentSubmissionApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import java.util.Set;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Set<Assignment> findByUser(User user);

    Set<Assignment> findByUserUsernameStartingWith(String startUsername);

    @Query("select a from Assignment a" +
            " where (a.status = 'submitted' and (a.codeReviewer is null or a.codeReviewer = : codeReviewer))" +
            " or a.codeReviewer = :codeReviewer")
    Set<Assignment> findByCodeReviewer(User codeReviewer);
}
