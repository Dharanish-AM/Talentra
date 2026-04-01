package com.talentra.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private Double salary;

    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private Double minCgpa;
    private Integer maxBacklogs;
    private String allowedDepartments;

    private LocalDateTime postedAt;

    @OneToMany(mappedBy = "jobProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Application> applications;

    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
    }
}
