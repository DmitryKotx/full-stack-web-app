package ru.kotov.AssignmentSubmissionApp.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AssignmentStatusEnum {
    PENDING_SUBMISSION("Pending Submission"),
    SUBMITTED("Submitted"),
    IN_REVIEW("In Review"),
    NEEDS_UPDATE("Needs Update"),
    COMPLETED("Completed"),
    RESUBMITTED("Resubmitted");


    private final String status;


    AssignmentStatusEnum(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }


}
