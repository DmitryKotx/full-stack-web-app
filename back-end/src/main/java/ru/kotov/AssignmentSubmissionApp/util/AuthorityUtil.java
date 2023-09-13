package ru.kotov.AssignmentSubmissionApp.util;

import ru.kotov.AssignmentSubmissionApp.model.User;

public class AuthorityUtil {
    public static Boolean hasRole(String role, User user) {
        return user.getAuthorities()
                .stream().anyMatch(auth -> auth.getAuthority().equals(role));
    }
}
