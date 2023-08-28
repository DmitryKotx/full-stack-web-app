package ru.kotov.AssignmentSubmissionApp.dto;

import lombok.Data;
import ru.kotov.AssignmentSubmissionApp.enums.AssignmentEnum;
import ru.kotov.AssignmentSubmissionApp.enums.AssignmentStatusEnum;
import ru.kotov.AssignmentSubmissionApp.model.Assignment;

@Data

public class AssignmentResponseDTO {
    private Assignment assignment;
    private AssignmentEnum[] assignmentEnums = AssignmentEnum.values();
    private AssignmentStatusEnum[] statusEnums = AssignmentStatusEnum.values();
    public AssignmentResponseDTO(Assignment assignment) {
        super();
        this.assignment = assignment;
    }
}
