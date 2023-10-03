package ru.kotov.AssignmentSubmissionApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kotov.AssignmentSubmissionApp.model.Task;
import ru.kotov.AssignmentSubmissionApp.repository.TaskRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }
}
