package com.talentra.dto;

import lombok.Data;

@Data
public class JobProfileRequest {
    private String title;
    private String description;
    private String requirements;
    private Double salary;
    private String location;
    private Long companyId;
    private Double minCgpa;
    private Integer maxBacklogs;
    private String allowedDepartments;
}
