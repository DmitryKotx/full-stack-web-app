package ru.kotov.AssignmentSubmissionApp.error;

public class IncorrectPasswordException extends Exception{
    public IncorrectPasswordException(String message) {
       super(message);
    }
}
