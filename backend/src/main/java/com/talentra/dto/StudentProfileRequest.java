package com.talentra.dto;

import lombok.Data;
import java.util.List;

@Data
public class StudentProfileRequest {
    private String department;
    private Double cgpa;
    private Integer backlogs;
    private List<String> skills;
    private String resumeUrl;
    private String phone;
    private Integer graduationYear;
}
