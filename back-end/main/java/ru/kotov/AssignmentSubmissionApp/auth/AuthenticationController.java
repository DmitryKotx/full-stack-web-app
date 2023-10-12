package ru.kotov.AssignmentSubmissionApp.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.util.JsonUtil;
import ru.kotov.AssignmentSubmissionApp.util.JwtUtil;


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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(JsonUtil.getJson(bindingResult));
        } else {
            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, String.valueOf(response.getToken())).body("{}");
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validationToken (@RequestParam("token") String token, @AuthenticationPrincipal User user) {
        boolean isValidateToken = jwtUtil.isTokenValid(token, user);
        return ResponseEntity.ok(isValidateToken);
    }
}
