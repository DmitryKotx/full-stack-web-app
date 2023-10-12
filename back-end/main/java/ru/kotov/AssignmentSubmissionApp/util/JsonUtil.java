package ru.kotov.AssignmentSubmissionApp.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

public class JsonUtil {
    public static String getJson (BindingResult bindingResult) throws JsonProcessingException {
        Map<String, String> validationErrors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            validationErrors.put(error.getField(), error.getDefaultMessage());
        }
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(validationErrors);
    }
}
