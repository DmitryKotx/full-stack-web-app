package ru.kotov.AssignmentSubmissionApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.service.AssigmentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/assignments")
public class AssignmentController {

    private final AssigmentService assigmentService;
    @PostMapping("")
    public ResponseEntity<?> createAssigment(@AuthenticationPrincipal User user) {
        Assignment newAssignment = assigmentService.save(user);
        return ResponseEntity.ok(newAssignment);
    }

}
