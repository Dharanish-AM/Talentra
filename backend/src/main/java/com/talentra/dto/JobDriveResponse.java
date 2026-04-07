package com.talentra.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.talentra.entity.JobProfile;
import lombok.Data;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Data
public class JobDriveResponse {
    private String id;
    private String companyId;
    private String companyName;
    private String title;
    private String role;
    private String description;
    
    @JsonProperty("package")
    private String packageStr;
    
    private String location;
    private String status;
    private int applicantCount;
    private String driveDate;
    private String deadline;
    private Eligibility eligibility;

    @Data
    public static class Eligibility {
        private Double minCgpa;
        private Integer maxBacklogs;
        private List<String> allowedDepartments;
    }

    public static JobDriveResponse fromEntity(JobProfile job) {
        JobDriveResponse resp = new JobDriveResponse();
        resp.setId(job.getId().toString());
        if (job.getCompany() != null) {
            resp.setCompanyId(job.getCompany().getId().toString());
            resp.setCompanyName(job.getCompany().getName());
        } else {
            resp.setCompanyName("Unknown");
        }
        resp.setTitle(job.getTitle());
        resp.setRole(job.getTitle());
        resp.setDescription(job.getDescription());
        resp.setPackageStr(job.getSalary() != null ? job.getSalary().toString() : "N/A");
        resp.setLocation(job.getLocation());
        if (job.getPostedAt() != null) {
            java.time.LocalDateTime postedAt = job.getPostedAt();
            java.time.LocalDateTime deadline = postedAt.plusDays(7);
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            
            resp.setDriveDate(postedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            resp.setDeadline(deadline.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            if (now.isBefore(postedAt)) {
                resp.setStatus("upcoming");
            } else if (now.isBefore(deadline)) {
                resp.setStatus("active");
            } else {
                resp.setStatus("completed");
            }
        } else {
            resp.setStatus("active");
        }
        
        resp.setApplicantCount(job.getApplications() != null ? job.getApplications().size() : 0);

        Eligibility el = new Eligibility();
        el.setMinCgpa(job.getMinCgpa() != null ? job.getMinCgpa() : 0.0);
        el.setMaxBacklogs(job.getMaxBacklogs() != null ? job.getMaxBacklogs() : 0);
        if (job.getAllowedDepartments() != null && !job.getAllowedDepartments().isEmpty()) {
            el.setAllowedDepartments(Arrays.stream(job.getAllowedDepartments().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toList()));
        } else {
            el.setAllowedDepartments(List.of("All"));
        }
        resp.setEligibility(el);
        
        return resp;
    }
}
