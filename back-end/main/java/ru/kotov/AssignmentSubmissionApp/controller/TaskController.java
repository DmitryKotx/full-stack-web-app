package ru.kotov.AssignmentSubmissionApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kotov.AssignmentSubmissionApp.model.Task;
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
    @PostMapping("")
    public ResponseEntity<?> addTask(@AuthenticationPrincipal User user) {
        Task task = taskService.save(new Task());
        return ResponseEntity.ok(task);
    }
    @PutMapping("{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task, @AuthenticationPrincipal User user) {
        Task updateTask = taskService.save(task);
        return ResponseEntity.ok(updateTask);
    }
    @GetMapping("{id}")
    public ResponseEntity<?> getTask(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Task updateTask = taskService.getTask(id).orElse(null);
        return ResponseEntity.ok(updateTask);
    }
}
