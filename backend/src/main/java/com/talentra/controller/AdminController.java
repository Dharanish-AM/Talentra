package com.talentra.controller;

import com.talentra.dto.*;
import com.talentra.entity.*;
import com.talentra.service.ReportService;
import com.talentra.service.AdminWorkflowService;
import com.talentra.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ReportService reportService;
    
    @Autowired
    private AdminWorkflowService workflowService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobProfileRepository jobProfileRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRoundRepository interviewRepository;

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        Map<String, Object> stats = reportService.getPlacementStatistics();
        Map<String, Object> response = new HashMap<>();
        response.put("analytics", stats);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies() {
        java.util.List<CompanyResponse> companies = companyRepository.findAll()
            .stream()
            .map(CompanyResponse::fromEntity)
            .collect(java.util.stream.Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("companies", companies);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/drives")
    public ResponseEntity<?> getAllDrives() {
        java.util.List<JobDriveResponse> drives = jobProfileRepository.findAll()
            .stream()
            .map(JobDriveResponse::fromEntity)
            .collect(java.util.stream.Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("drives", drives);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        java.util.List<ApplicationResponse> apps = applicationRepository.findAll()
            .stream()
            .map(ApplicationResponse::fromEntity)
            .collect(java.util.stream.Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("applications", apps);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/interviews")
    public ResponseEntity<?> getAllInterviews() {
        java.util.List<InterviewResponse> interviews = interviewRepository.findAll()
            .stream()
            .map(InterviewResponse::fromEntity)
            .collect(java.util.stream.Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("interviews", interviews);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/companies")
    public ResponseEntity<?> createCompany(@RequestBody CompanyRequest request) {
        Company company = new Company();
        company.setName(request.getName());
        company.setIndustry(request.getIndustry());
        company.setLogo(request.getLogo());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setContactEmail(request.getContactEmail());
        companyRepository.save(company);
        Map<String, Object> data = new HashMap<>();
        data.put("company", CompanyResponse.fromEntity(company));
        return ResponseEntity.ok(ApiResponse.success(data, "Company created successfully"));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @RequestBody CompanyRequest request) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setName(request.getName());
        company.setIndustry(request.getIndustry());
        company.setLogo(request.getLogo());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setContactEmail(request.getContactEmail());
        companyRepository.save(company);
        Map<String, Object> data = new HashMap<>();
        data.put("company", CompanyResponse.fromEntity(company));
        return ResponseEntity.ok(ApiResponse.success(data, "Company updated successfully"));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        companyRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Company deleted successfully"));
    }

    @PostMapping("/drives")
    public ResponseEntity<?> createDrive(@RequestBody JobProfileRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
            .orElseThrow(() -> new RuntimeException("Company not found"));
        JobProfile drive = new JobProfile();
        drive.setTitle(request.getTitle());
        drive.setDescription(request.getDescription());
        drive.setRequirements(request.getRequirements());
        drive.setSalary(request.getSalary());
        drive.setLocation(request.getLocation());
        drive.setCompany(company);
        drive.setMinCgpa(request.getMinCgpa());
        drive.setMaxBacklogs(request.getMaxBacklogs());
        drive.setAllowedDepartments(request.getAllowedDepartments());
        jobProfileRepository.save(drive);
        Map<String, Object> data = new HashMap<>();
        data.put("drive", JobDriveResponse.fromEntity(drive));
        return ResponseEntity.ok(ApiResponse.success(data, "Job drive created successfully"));
    }

    @PutMapping("/drives/{id}")
    public ResponseEntity<?> updateDrive(@PathVariable Long id, @RequestBody JobProfileRequest request) {
        JobProfile drive = jobProfileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job drive not found"));
        Company company = companyRepository.findById(request.getCompanyId())
            .orElseThrow(() -> new RuntimeException("Company not found"));
        drive.setTitle(request.getTitle());
        drive.setDescription(request.getDescription());
        drive.setRequirements(request.getRequirements());
        drive.setSalary(request.getSalary());
        drive.setLocation(request.getLocation());
        drive.setCompany(company);
        drive.setMinCgpa(request.getMinCgpa());
        drive.setMaxBacklogs(request.getMaxBacklogs());
        drive.setAllowedDepartments(request.getAllowedDepartments());
        jobProfileRepository.save(drive);
        Map<String, Object> data = new HashMap<>();
        data.put("drive", JobDriveResponse.fromEntity(drive));
        return ResponseEntity.ok(ApiResponse.success(data, "Job drive updated successfully"));
    }

    @DeleteMapping("/drives/{id}")
    public ResponseEntity<?> deleteDrive(@PathVariable Long id) {
        jobProfileRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Job drive deleted successfully"));
    }

    @GetMapping("/drives/{id}/applicants")
    public ResponseEntity<?> getDriveApplicants(@PathVariable Long id) {
        java.util.List<ApplicationResponse> applicants = workflowService.getDriveApplicants(id)
            .stream()
            .map(ApplicationResponse::fromEntity)
            .collect(java.util.stream.Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("applicants", applicants);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/applicants/shortlist")
    public ResponseEntity<?> shortlistApplicants(@RequestBody BulkActionRequest request) {
        workflowService.shortlistApplicants(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Applicants shortlisted successfully"));
    }

    @PostMapping("/applicants/reject")
    public ResponseEntity<?> rejectApplicant(@RequestBody Map<String, Long> request) {
        workflowService.rejectApplicant(request.get("applicationId"));
        return ResponseEntity.ok(ApiResponse.success(null, "Applicant rejected successfully"));
    }

    @PostMapping("/interviews/schedule")
    public ResponseEntity<?> scheduleInterviews(@RequestBody BulkInterviewRequest request) {
        java.util.List<InterviewResponse> rounds = workflowService.scheduleInterviews(request)
            .stream()
            .map(InterviewResponse::fromEntity)
            .collect(java.util.stream.Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("interviews", rounds);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/offers/release")
    public ResponseEntity<?> releaseOffers(@RequestBody BulkActionRequest request) {
        workflowService.releaseOffers(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Offers released successfully"));
    }

    @GetMapping("/analytics/export")
    public ResponseEntity<byte[]> exportAnalytics() {
        byte[] csvData = reportService.generateExportReport();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=placement_analytics.csv")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csvData);
    }
}
