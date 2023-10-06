package ru.kotov.AssignmentSubmissionApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.service.TaskService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    @GetMapping()
    public ResponseEntity<?> getTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getTasks());
    }
}
