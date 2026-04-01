package com.talentra.service;

import com.talentra.entity.Application;
import com.talentra.entity.ApplicationStatus;
import com.talentra.entity.StudentProfile;
import com.talentra.entity.JobProfile;
import com.talentra.repository.ApplicationRepository;
import com.talentra.repository.StudentProfileRepository;
import com.talentra.repository.JobProfileRepository;
import com.talentra.dto.ApplicationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JobProfileRepository jobProfileRepository;

    public Application applyToJob(ApplicationRequest request) {
        StudentProfile student = studentProfileRepository.findById(request.getStudentProfileId())
                .orElseThrow(() -> new RuntimeException("Student Profile not found"));

        JobProfile job = jobProfileRepository.findById(request.getJobProfileId())
                .orElseThrow(() -> new RuntimeException("Job Profile not found"));

        Application application = new Application();
        application.setStudentProfile(student);
        application.setJobProfile(job);
        application.setStatus(ApplicationStatus.APPLIED);

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByStudent(Long studentProfileId) {
        return applicationRepository.findByStudentProfileId(studentProfileId);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public Application updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Application application = getApplicationById(applicationId);
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public List<Application> updateMultipleStatuses(List<Long> ids, ApplicationStatus status) {
        List<Application> apps = applicationRepository.findAllById(ids);
        apps.forEach(app -> app.setStatus(status));
        return applicationRepository.saveAll(apps);
    }

    public List<Application> getApplicationsByDrive(Long driveId) {
        return applicationRepository.findByJobProfileId(driveId);
    }

    public List<Application> getShortlistedApplicationsByStatus() {
        return applicationRepository.findByStatus(ApplicationStatus.SHORTLISTED);
    }
}
