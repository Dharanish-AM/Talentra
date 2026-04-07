package com.talentra.dto;

import com.talentra.entity.Application;
import lombok.Data;
import java.time.format.DateTimeFormatter;

@Data
public class ApplicationResponse {
    private String id;
    private String studentId;
    private String studentName;
    private String driveId;
    private String driveName;
    private String companyName;
    private String status;
    private String appliedAt;
    private String updatedAt;
    private String resumeUrl;

    public static ApplicationResponse fromEntity(Application app) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(app.getId().toString());
        resp.setStatus(app.getStatus().name().toLowerCase());
        
        if (app.getStudentProfile() != null && app.getStudentProfile().getUser() != null) {
            resp.setStudentId(app.getStudentProfile().getUser().getId().toString());
            resp.setResumeUrl(app.getStudentProfile().getResumeUrl());
            if (app.getStudentProfile().getUser() != null) {
                resp.setStudentName(app.getStudentProfile().getUser().getName());
            }
        }
        
        if (app.getJobProfile() != null) {
            resp.setDriveId(app.getJobProfile().getId().toString());
            resp.setDriveName(app.getJobProfile().getTitle());
            if (app.getJobProfile().getCompany() != null) {
                resp.setCompanyName(app.getJobProfile().getCompany().getName());
            }
        }
        
        if (app.getAppliedAt() != null) {
            resp.setAppliedAt(app.getAppliedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            // Default updatedAt to appliedAt if null
            resp.setUpdatedAt(resp.getAppliedAt());
        }
        
        return resp;
    }
}
