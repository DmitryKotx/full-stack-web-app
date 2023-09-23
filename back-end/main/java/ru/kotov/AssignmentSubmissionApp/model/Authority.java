package ru.kotov.AssignmentSubmissionApp.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import ru.kotov.AssignmentSubmissionApp.enums.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "authority")
public class Authority implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private Role role;
    @ManyToOne(optional = false)
    private User user;

    @Override
    public String getAuthority() {
        return role.name();
    }

    public Authority(Role role) {
        this.role = role;
    }
}
