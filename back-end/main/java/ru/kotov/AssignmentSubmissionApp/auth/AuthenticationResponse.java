package ru.kotov.AssignmentSubmissionApp.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.kotov.AssignmentSubmissionApp.error.IncorrectPasswordException;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private IncorrectPasswordException exception;

}
