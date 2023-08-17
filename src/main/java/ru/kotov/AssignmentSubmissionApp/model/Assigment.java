package ru.kotov.AssignmentSubmissionApp.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "assigment")
public class Assigment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String status;
    private String githubUrl;
    private String branch;
    private String codeReviewVideoUrl;
    @ManyToOne(optional = false)
    private User user;
}
