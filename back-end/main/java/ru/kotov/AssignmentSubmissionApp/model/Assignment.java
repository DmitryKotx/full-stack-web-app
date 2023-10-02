package ru.kotov.AssignmentSubmissionApp.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "assignment")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer number;
    private String status;
    private String githubUrl;
    private String codeReviewVideoUrl;
    @ManyToOne(optional = false)
    private User user;
    @ManyToOne
    private User codeReviewer;
    @OneToOne
    private Task task;
}
