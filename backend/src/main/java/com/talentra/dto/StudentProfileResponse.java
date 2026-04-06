package com.talentra.dto;

import com.talentra.entity.StudentProfile;
import lombok.Data;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class StudentProfileResponse {
    private Long id;
    private String userId;
    private String department;
    private Double cgpa;
    private Integer backlogs;
    private List<String> skills;
    private String resumeUrl;
    private String phone;
    private Integer graduationYear;

    public static StudentProfileResponse fromEntity(StudentProfile profile) {
        StudentProfileResponse resp = new StudentProfileResponse();
        resp.setId(profile.getId());
        resp.setUserId(profile.getUser() != null ? profile.getUser().getId().toString() : null);
        resp.setDepartment(profile.getDepartment());
        resp.setCgpa(profile.getCgpa() != null ? profile.getCgpa() : 0.0);
        resp.setBacklogs(profile.getBacklogs() != null ? profile.getBacklogs() : 0);
        
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            resp.setSkills(Arrays.stream(profile.getSkills().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList()));
        } else {
            resp.setSkills(List.of());
        }
        
        resp.setResumeUrl(profile.getResumeUrl());
        resp.setPhone(profile.getPhone());
        resp.setGraduationYear(profile.getGraduationYear());
        return resp;
    }
}
