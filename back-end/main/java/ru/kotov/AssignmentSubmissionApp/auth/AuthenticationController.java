package ru.kotov.AssignmentSubmissionApp.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kotov.AssignmentSubmissionApp.enums.Role;
import ru.kotov.AssignmentSubmissionApp.model.Authority;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.util.JwtUtil;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, String.valueOf(authenticationService.register(request).getToken())).build();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, String.valueOf(authenticationService.authenticate(request).getToken())).build();
    }
    @GetMapping("/validate")
    public ResponseEntity<?> validationToken (@RequestParam("token") String token, @AuthenticationPrincipal User user) {
        boolean isValidateToken = jwtUtil.isTokenValid(token, user);
        return ResponseEntity.ok(isValidateToken);
    }
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> roles = new ArrayList<>(List.of(Role.values()));
        return ResponseEntity.ok(roles);
    }
}
