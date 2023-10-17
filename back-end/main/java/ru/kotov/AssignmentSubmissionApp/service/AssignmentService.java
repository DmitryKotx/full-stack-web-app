package ru.kotov.AssignmentSubmissionApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import ru.kotov.AssignmentSubmissionApp.enums.AssignmentStatusEnum;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.repository.AssignmentRepository;
import java.util.Optional;
import java.util.Set;

import static ru.kotov.AssignmentSubmissionApp.enums.Role.REVIEWER;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    public Assignment save(User user) {
        Assignment assignment = new Assignment();
        assignment.setStatus(AssignmentStatusEnum.PENDING_SUBMISSION.getStatus());
        assignment.setNumber(findNextAssignmentToSubmit(user));
        assignment.setUser(user);
        assignmentRepository.save(assignment);
        return assignment;
    }

    private Integer findNextAssignmentToSubmit(User user) {
        Set<Assignment> assignmentsByUser = assignmentRepository.findByUser(user);
        if (assignmentsByUser == null) {
            return 1;
        }
        Optional<Integer> nextAssignmentNumOpt = assignmentsByUser.stream()
                .sorted((a1, a2) -> {
                    if(a1.getNumber() == null) return 1;
                    if(a2.getNumber() == null) return 1;
                    return a2.getNumber().compareTo(a1.getNumber());
                })
                .map(assignment -> {
                    if(assignment.getNumber() == null) return 1;
                    return assignment.getNumber() + 1;
                })
                .findFirst();
        return nextAssignmentNumOpt.orElse(1);
    }

    public Set<Assignment> findByUser(User user) {
        boolean hasCodeReviewerRole = user.getAuthorities()
                .stream().anyMatch(auth -> REVIEWER.name().equals(auth.getAuthority()));
        if(hasCodeReviewerRole) {
            return assignmentRepository.findByCodeReviewer(user);
        } else {
            return assignmentRepository.findByUser(user);
        }
    }

    public Set<Assignment> findByUsername(String username) {
        return findByUserUsername(username);

    }
    public Set<Assignment> findByUserUsername(String startUsername) {
        return assignmentRepository.findByUserUsername(startUsername);
    }


    public Optional<Assignment> findById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment save(Assignment assignment, BindingResult bindingResult) {
        if(assignment.getTask() == null) {
            bindingResult.rejectValue("task", "", "Select a task");
        }
        if(assignment.getGithubUrl() == null || assignment.getGithubUrl().equals("")) {
            bindingResult.rejectValue("githubUrl", "", "The field with a link to github should not be empty");
        }
        if(bindingResult.hasErrors()) {
            return new Assignment();
        } else {
            return assignmentRepository.save(assignment);
        }
    }

}
