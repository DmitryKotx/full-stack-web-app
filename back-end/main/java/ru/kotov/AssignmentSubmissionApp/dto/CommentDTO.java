package ru.kotov.AssignmentSubmissionApp.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private Long assignmentId;
    private String text;
    private String user;
    private LocalDateTime createdDate;
}
