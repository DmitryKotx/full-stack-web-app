package ru.kotov.AssignmentSubmissionApp.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private Long assignmentId;
    private String text;
    private String user;
}
