package ru.kotov.AssignmentSubmissionApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kotov.AssignmentSubmissionApp.enums.AssignmentStatusEnum;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.repository.AssignmentRepository;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    public Assignment save(User user) {
        Assignment assignment = new Assignment();
        assignment.setStatus(AssignmentStatusEnum.PENDING_SUBMISSION.getStatus());
        assignment.setUser(user);
        assignmentRepository.save(assignment);
        return assignment;
    }

    public Set<Assignment> findByUser(User user) {
        return assignmentRepository.findByUser(user);
    }

    public Optional<Assignment> findById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment save(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }
}
