package com.talentra.dto;

import com.talentra.entity.Application;
import lombok.Data;
import java.time.format.DateTimeFormatter;

@Data
public class RecruiterApplicationResponse {
    private String id;
    private String studentId;
    private String studentName;
    private String studentEmail;
    private String driveId;
    private String driveName;
    private String companyName;
    private String status;
    private String appliedAt;
    private String updatedAt;

    public static RecruiterApplicationResponse fromEntity(Application app) {
        RecruiterApplicationResponse res = new RecruiterApplicationResponse();
        res.setId(String.valueOf(app.getId()));
        
        if (app.getStudentProfile() != null && app.getStudentProfile().getUser() != null) {
            res.setStudentId(String.valueOf(app.getStudentProfile().getUser().getId()));
            res.setStudentName(app.getStudentProfile().getUser().getName());
            res.setStudentEmail(app.getStudentProfile().getUser().getEmail());
        }
        
        if (app.getJobProfile() != null) {
            res.setDriveId(String.valueOf(app.getJobProfile().getId()));
            res.setDriveName(app.getJobProfile().getTitle());
            if (app.getJobProfile().getCompany() != null) {
                res.setCompanyName(app.getJobProfile().getCompany().getName());
            }
        }
        
        res.setStatus(app.getStatus().name().toLowerCase());
        
        if (app.getAppliedAt() != null) {
            res.setAppliedAt(app.getAppliedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        
        res.setUpdatedAt(res.getAppliedAt());
        
        return res;
    }
}
