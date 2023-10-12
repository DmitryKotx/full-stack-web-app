package ru.kotov.AssignmentSubmissionApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import ru.kotov.AssignmentSubmissionApp.model.Task;
import ru.kotov.AssignmentSubmissionApp.repository.TaskRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }
    public Task save (Task task) {
        return taskRepository.save(task);
    }
    public Optional<Task> getTask(Long id) {
        return taskRepository.findById(id);
    }
    public Task save (Task task, BindingResult bindingResult) {
        if(task.getText() == null) {
            bindingResult.rejectValue("text", "", "The text field should not be empty");
            return new Task();
        } else {
            return taskRepository.save(task);
        }
    }}
