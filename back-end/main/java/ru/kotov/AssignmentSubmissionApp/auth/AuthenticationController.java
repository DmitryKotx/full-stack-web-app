package ru.kotov.AssignmentSubmissionApp.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kotov.AssignmentSubmissionApp.enums.Role;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.util.JwtUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, BindingResult bindingResult) throws JsonProcessingException {
        AuthenticationResponse response = authenticationService.register(request, bindingResult);
        return getResponseEntity(bindingResult, response);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request, BindingResult bindingResult) throws JsonProcessingException {
        AuthenticationResponse response = authenticationService.authenticate(request, bindingResult);
        return getResponseEntity(bindingResult, response);
    }

    private ResponseEntity<?> getResponseEntity(BindingResult bindingResult, AuthenticationResponse response) throws JsonProcessingException {
        if (bindingResult.hasErrors()) {
            Map<String, String> validationErrors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                validationErrors.put(error.getField(), error.getDefaultMessage());
            }
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(validationErrors);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(json);
        } else {
            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, String.valueOf(response.getToken())).body("{}");
        }
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
