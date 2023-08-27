package ru.kotov.AssignmentSubmissionApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kotov.AssignmentSubmissionApp.dto.AssignmentResponseDTO;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.service.AssignmentService;

import java.util.Optional;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    @PostMapping("")
    public ResponseEntity<?> createAssignment(@AuthenticationPrincipal User user) {
        Assignment newAssignment = assignmentService.save(user);
        return ResponseEntity.ok(newAssignment);
    }

    @GetMapping("")
    public ResponseEntity<?> getAssignments(@AuthenticationPrincipal User user) {
        Set<Assignment> assignments = assignmentService.findByUser(user);
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
        Assignment updateAssignment = assignmentService.save(assignment);
        return ResponseEntity.ok(updateAssignment);
    }

}
