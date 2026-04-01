package com.talentra.controller;

import com.talentra.dto.ApiResponse;
import com.talentra.entity.Application;
import com.talentra.entity.ApplicationStatus;
import com.talentra.entity.InterviewRound;
import com.talentra.service.ApplicationService;
import com.talentra.service.InterviewService;
import com.talentra.dto.InterviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private com.talentra.repository.InterviewRoundRepository interviewRepository;

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @GetMapping("/applications/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable Long jobId) {
        List<Application> applications = applicationService.getApplicationsByDrive(jobId); 
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("applications", applications);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @GetMapping("/applications/shortlisted")
    public ResponseEntity<?> getShortlistedApplications() {
        List<Application> applications = applicationService.getShortlistedApplicationsByStatus();
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("applications", applications);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @GetMapping("/candidates")
    public ResponseEntity<?> getCandidates() {
        List<InterviewRound> candidates = interviewRepository.findAll();
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("candidates", candidates);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status) {
        Application application = applicationService.updateApplicationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(application, "Status updated"));
    }

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @PostMapping("/interviews/schedule")
    public ResponseEntity<?> scheduleInterview(@RequestBody InterviewRequest request) {
        InterviewRound round = interviewService.scheduleInterview(request);
        return ResponseEntity.ok(ApiResponse.success(round, "Interview scheduled"));
    }

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @PostMapping("/feedback/{id}")
    public ResponseEntity<?> provideFeedback(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        InterviewRound round = interviewService.updateFeedback(id, request.get("feedback"));
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("interview", round);
        return ResponseEntity.ok(ApiResponse.success(data, "Feedback submitted"));
    }

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @PutMapping("/candidates/{id}/result")
    public ResponseEntity<?> updateCandidateResult(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        String result = request.get("result");
        ApplicationStatus status = result.equals("selected") ? ApplicationStatus.OFFERED : 
                                   result.equals("rejected") ? ApplicationStatus.REJECTED : null;
        
        InterviewRound round = interviewRepository.findById(id).orElseThrow();
        if (status != null) {
            applicationService.updateApplicationStatus(round.getApplication().getId(), status);
        }
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("interview", round);
        return ResponseEntity.ok(ApiResponse.success(data, "Result updated"));
    }
}
