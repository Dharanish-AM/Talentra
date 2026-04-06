package com.talentra.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.talentra.entity.JobProfile;
import lombok.Data;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Data
public class JobDriveResponse {
    private Long id;
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
        resp.setId(job.getId());
        resp.setCompanyName(job.getCompany() != null ? job.getCompany().getName() : "Unknown");
        resp.setTitle(job.getTitle());
        resp.setRole(job.getTitle());
        resp.setDescription(job.getDescription());
        resp.setPackageStr(job.getSalary() != null ? job.getSalary().toString() : "N/A");
        resp.setLocation(job.getLocation());
        resp.setStatus("active");
        resp.setApplicantCount(job.getApplications() != null ? job.getApplications().size() : 0);
        
        if (job.getPostedAt() != null) {
            resp.setDriveDate(job.getPostedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            resp.setDeadline(job.getPostedAt().plusDays(7).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

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
