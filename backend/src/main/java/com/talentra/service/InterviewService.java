package com.talentra.service;

import com.talentra.entity.InterviewRound;
import com.talentra.entity.Application;
import com.talentra.repository.InterviewRoundRepository;
import com.talentra.dto.InterviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewRoundRepository interviewRepository;

    @Autowired
    private ApplicationService applicationService;

    public InterviewRound scheduleInterview(InterviewRequest request) {
        Application application = applicationService.getApplicationById(request.getApplicationId());

        InterviewRound round = new InterviewRound();
        round.setApplication(application);
        round.setRoundNumber(request.getRoundNumber());
        round.setScheduledTime(request.getScheduledTime());
        round.setInterviewLink(request.getInterviewLink());

        return interviewRepository.save(round);
    }

    public List<InterviewRound> getInterviewsByApplication(Long applicationId) {
        return interviewRepository.findByApplicationId(applicationId);
    }

    public List<InterviewRound> getInterviewsByStudent(Long studentId) {
        return interviewRepository.findByApplicationStudentProfileId(studentId);
    }

    public InterviewRound updateFeedback(Long roundId, String feedback) {
        InterviewRound round = interviewRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Interview round not found"));
        round.setFeedback(feedback);
        return interviewRepository.save(round);
    }
}
