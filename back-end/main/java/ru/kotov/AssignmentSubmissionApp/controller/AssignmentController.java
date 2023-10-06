package ru.kotov.AssignmentSubmissionApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kotov.AssignmentSubmissionApp.dto.AssignmentResponseDTO;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.service.AssignmentService;
import ru.kotov.AssignmentSubmissionApp.service.UserService;
import ru.kotov.AssignmentSubmissionApp.util.AuthorityUtil;

import java.util.Optional;
import java.util.Set;

import static ru.kotov.AssignmentSubmissionApp.enums.Role.REVIEWER;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserService userService;

    @PostMapping("")
    public ResponseEntity<?> createAssignment(@AuthenticationPrincipal User user) {
        Assignment newAssignment = assignmentService.save(user);
        return ResponseEntity.ok(newAssignment);
    }

    @GetMapping("")
    public ResponseEntity<?> getAssignments(@RequestParam("username") String username, @AuthenticationPrincipal User user) {
        Set<Assignment> assignments;
        if (username.equals("null")) assignments = assignmentService.findByUser(user);
        else assignments = assignmentService.findByUsername(username);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getAssignment(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Optional<Assignment> assignment = assignmentService.findById(id);
        return ResponseEntity.ok(new AssignmentResponseDTO(assignment.orElse(new Assignment())));
    }
    @PutMapping("{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody Assignment assignment,
                                              @AuthenticationPrincipal User user) {
        if (assignment.getCodeReviewer() != null) {
            User codeReviewer = assignment.getCodeReviewer();
            codeReviewer = userService.findUserByUsername(codeReviewer.getUsername()).orElse(new User());

            if(AuthorityUtil.hasRole(REVIEWER.name(), codeReviewer)) {
                assignment.setCodeReviewer(codeReviewer);
            }
        }
        Assignment updateAssignment = assignmentService.save(assignment);
        return ResponseEntity.ok(updateAssignment);
    }

}
