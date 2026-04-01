package com.talentra.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String industry;

    private String logo;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String website;

    @Column(nullable = false)
    private String contactEmail;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<JobProfile> jobProfiles;
}
