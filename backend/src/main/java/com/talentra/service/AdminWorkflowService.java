package com.talentra.service;

import com.talentra.dto.BulkActionRequest;
import com.talentra.dto.BulkInterviewRequest;
import com.talentra.dto.InterviewRequest;
import com.talentra.entity.*;
import com.talentra.repository.ApplicationRepository;
import com.talentra.repository.InterviewRoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminWorkflowService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRoundRepository interviewRepository;

    public List<Application> getDriveApplicants(Long driveId) {
        return applicationRepository.findAll().stream()
                .filter(app -> app.getJobProfile().getId().equals(driveId))
                .collect(Collectors.toList());
    }

    @Transactional
    public void shortlistApplicants(BulkActionRequest request) {
        List<Application> applications = applicationRepository.findAllById(request.getApplicationIds());
        applications.forEach(app -> app.setStatus(ApplicationStatus.SHORTLISTED));
        applicationRepository.saveAll(applications);
    }

    @Transactional
    public void rejectApplicant(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(ApplicationStatus.REJECTED);
        applicationRepository.save(application);
    }

    @Transactional
    public List<InterviewRound> scheduleInterviews(BulkInterviewRequest request) {
        List<InterviewRound> rounds = request.getInterviews().stream().map(req -> {
            Application application = applicationRepository.findById(req.getApplicationId())
                    .orElseThrow(() -> new RuntimeException("Application not found for ID: " + req.getApplicationId()));
            
            InterviewRound round = new InterviewRound();
            round.setApplication(application);
            round.setRoundNumber(req.getRoundNumber());
            round.setScheduledTime(req.getScheduledTime());
            round.setInterviewLink(req.getInterviewLink());
            round.setStatus(InterviewStatus.SCHEDULED);
            return round;
        }).collect(Collectors.toList());

        return interviewRepository.saveAll(rounds);
    }

    @Transactional
    public void releaseOffers(BulkActionRequest request) {
        List<Application> applications = applicationRepository.findAllById(request.getApplicationIds());
        applications.forEach(app -> app.setStatus(ApplicationStatus.OFFERED));
        applicationRepository.saveAll(applications);
    }
}
