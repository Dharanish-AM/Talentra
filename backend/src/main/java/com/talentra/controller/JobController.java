package com.talentra.controller;

import com.talentra.dto.ApiResponse;
import com.talentra.dto.JobProfileRequest;
import com.talentra.entity.JobProfile;
import com.talentra.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createJobProfile(@RequestBody JobProfileRequest request) {
        JobProfile jobProfile = jobService.createJobProfile(request);
        return ResponseEntity.ok(ApiResponse.success(jobProfile, "Job profile created"));
    }

    @GetMapping
    public ResponseEntity<?> getAllJobs() {
        List<JobProfile> jobs = jobService.getAllJobProfiles();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        JobProfile job = jobService.getJobProfileById(id);
        return ResponseEntity.ok(ApiResponse.success(job));
    }
}
