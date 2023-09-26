package ru.kotov.AssignmentSubmissionApp.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import ru.kotov.AssignmentSubmissionApp.model.Authority;
import ru.kotov.AssignmentSubmissionApp.model.User;
import ru.kotov.AssignmentSubmissionApp.service.UserService;
import ru.kotov.AssignmentSubmissionApp.util.JwtUtil;

import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request, BindingResult bindingResult) {
        if(request.getRole() == null)
            bindingResult.rejectValue("role", "", "Role is not selected!");

        if (!isValidPassword(request.getPassword())) {
            bindingResult.rejectValue("password", "",
                    """
                            Password does not meet the criteria:
                            1) at least one lowercase Latin letter
                            2) at least one capital Latin letter
                            3) at least one digit""");
        }
        Authority authority = new Authority(request.getRole());
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .cohortStartDate(LocalDate.now())
                .password(passwordEncoder.encode(request.getPassword()))
                .authorities(List.of(authority))
                .build();

        authority.setUser(user);
        try {
            userService.save(user);
        } catch (Exception e) {

            if (e.toString().contains("email") ||
                    userService.findUserByEmail(request.getEmail()).isPresent()) {
                bindingResult.rejectValue("email", "",
                        """
                                Email does not meet the criteria:
                                1) the email field should not be empty
                                2) the length should be between 5 and 30 characters
                                3) the email must be unique""");
            }
            if (e.toString().contains("username") ||
                    userService.findUserByUsername(request.getUsername()).isPresent()) {
                bindingResult.rejectValue("username", "",
                        """
                                Username does not meet the criteria:
                                1) the username field should not be empty
                                2) the length should be between 1 and 30 characters
                                3) the username must be unique""");
            }
        }
        if(!bindingResult.hasErrors()) {
            var jwtToken = jwtUtil.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        } else {
            return new AuthenticationResponse();
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, BindingResult bindingResult) {
        var user = userService.findUserByUsername(request.getUsername()).orElse(null);

        if (user == null) {
            bindingResult.rejectValue("username", "",
                    "The user with this username is not registered");
        }

        if(!isValidPassword(request.getPassword())) {
            bindingResult.rejectValue("password", "",
                    """
                            Password does not meet the criteria:
                            1) at least one lowercase Latin letter
                            2) at least one capital Latin letter
                            3) at least one digit""");
        }
        if (!bindingResult.hasErrors()) {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            var jwtToken = jwtUtil.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        } else {
            return new AuthenticationResponse();
        }
    }

    public boolean isValidPassword(String password) {
        String regex = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }
}
