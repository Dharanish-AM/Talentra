package com.talentra.controller;

import com.talentra.dto.*;
import com.talentra.entity.*;
import com.talentra.service.*;
import com.talentra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private StudentProfileService profileService;

    @Autowired
    private JobService jobService;

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/drives/{driveId}/apply")
    public ResponseEntity<?> applyToJob(@PathVariable Long driveId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        StudentProfile profile = profileService.getStudentProfileByUserId(user.getId());
        
        ApplicationRequest request = new ApplicationRequest();
        request.setJobProfileId(driveId);
        request.setStudentProfileId(profile.getId());
        
        Application application = applicationService.applyToJob(request);
        Map<String, Object> data = new HashMap<>();
        data.put("application", ApplicationResponse.fromEntity(application));
        return ResponseEntity.ok(ApiResponse.success(data, "Application submitted"));
    }
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/applications")
    public ResponseEntity<?> getMyApplications(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        StudentProfile profile = profileService.getStudentProfileByUserId(user.getId());
        List<ApplicationResponse> applications = applicationService.getApplicationsByStudent(profile.getId())
            .stream()
            .map(ApplicationResponse::fromEntity)
            .toList();
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("applications", applications);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/drives")
    public ResponseEntity<?> getEligibleDrives() {
        List<JobDriveResponse> drives = jobService.getAllJobProfiles()
            .stream()
            .map(JobDriveResponse::fromEntity)
            .toList();
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("drives", drives);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/interviews")
    public ResponseEntity<?> getMyInterviews(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        StudentProfile profile = profileService.getStudentProfileByUserId(user.getId());
        List<InterviewResponse> interviews = interviewService.getInterviewsByStudent(profile.getId())
            .stream()
            .map(InterviewResponse::fromEntity)
            .toList();
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("interviews", interviews);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody StudentProfileRequest details) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        StudentProfile profile = profileService.createOrUpdateProfile(user.getId(), details);
        Map<String, Object> data = new HashMap<>();
        data.put("profile", StudentProfileResponse.fromEntity(profile));
        return ResponseEntity.ok(ApiResponse.success(data, "Profile updated"));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        StudentProfile profile = profileService.getStudentProfileByUserId(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("profile", StudentProfileResponse.fromEntity(profile));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/profile/resume")
    public ResponseEntity<?> uploadResume(Authentication authentication, @RequestParam("resume") MultipartFile file) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        
        StudentProfileRequest request = new StudentProfileRequest();
        request.setResumeUrl("resumes/" + file.getOriginalFilename());
        
        StudentProfile profile = profileService.createOrUpdateProfile(user.getId(), request);
        
        Map<String, Object> data = new HashMap<>();
        data.put("profile", StudentProfileResponse.fromEntity(profile));
        return ResponseEntity.ok(ApiResponse.success(data, "Resume uploaded successfully"));
    }
}
