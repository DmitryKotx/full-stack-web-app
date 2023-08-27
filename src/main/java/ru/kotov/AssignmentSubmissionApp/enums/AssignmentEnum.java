package ru.kotov.AssignmentSubmissionApp.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)

public enum AssignmentEnum {
    ASSIGNMENT_1(1, "ASSIGNMENT 1"),
    ASSIGNMENT_2(2, "ASSIGNMENT 2"),
    ASSIGNMENT_3(3, "ASSIGNMENT 3"),
    ASSIGNMENT_4(4, "ASSIGNMENT 4"),
    ASSIGNMENT_5(5, "ASSIGNMENT 5");

    private Integer number;
    private String name;

    AssignmentEnum(Integer number, String name) {
        this.number = number;
        this.name = name;
    }

    public Integer getNumber() {
        return number;
    }

    public String getName() {
        return name;
    }
}
