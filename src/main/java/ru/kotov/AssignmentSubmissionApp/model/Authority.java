package ru.kotov.AssignmentSubmissionApp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
@Getter
@Setter
@Entity
@Table(name = "authority")
public class Authority implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String authority;
    @ManyToOne(optional = false)
    private User user;

    public Authority(String authority) {
        this.authority = authority;
    }

    public Authority() {

    }

    @Override
    public String getAuthority() {
        return authority;
    }
}
