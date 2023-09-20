package ru.kotov.AssignmentSubmissionApp.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import ru.kotov.AssignmentSubmissionApp.model.Authority;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.repository.UserRepository;
import ru.kotov.AssignmentSubmissionApp.util.JwtUtil;
import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request, BindingResult bindingResult) {
        if(!isValidPassword(request.getPassword())) {
            bindingResult.rejectValue("password","",
                    "The password does not meet the criteria:\n" +
                    "1) at least one lowercase Latin letter\n" +
                    "2) at least one capital Latin letter\n" +
                    "3)at least one digit");
            return new AuthenticationResponse();
        }
        Authority authority = new Authority(request.getRole().name());
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .cohortStartDate(LocalDate.now())
                .password(passwordEncoder.encode(request.getPassword()))
                .authorities(List.of(authority))
                .build();
        authority.setUser(user);
        repository.save(user);
        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername()).orElseThrow();
        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public boolean isValidPassword(String password) {
        String regex = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }
}
