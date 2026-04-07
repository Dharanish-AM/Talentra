package com.talentra.dto;

import com.talentra.entity.InterviewRound;
import lombok.Data;
import java.time.format.DateTimeFormatter;

@Data
public class RecruiterCandidateResponse {
    private String id;
    private String driveId;
    private String studentId;
    private String studentName;
    private String studentEmail;
    private String driveTitle;
    private String companyName;
    private String role;
    private String date;
    private String time;
    private String mode;
    private String link;
    private String feedback;
    private String result;

    public static RecruiterCandidateResponse fromEntity(InterviewRound round) {
        RecruiterCandidateResponse res = new RecruiterCandidateResponse();
        res.setId(String.valueOf(round.getId()));
        
        if (round.getApplication() != null && round.getApplication().getStudentProfile() != null && round.getApplication().getStudentProfile().getUser() != null) {
            res.setStudentId(String.valueOf(round.getApplication().getStudentProfile().getUser().getId()));
            res.setStudentName(round.getApplication().getStudentProfile().getUser().getName());
            res.setStudentEmail(round.getApplication().getStudentProfile().getUser().getEmail());
            
            if (round.getApplication().getJobProfile() != null) {
                res.setDriveId(String.valueOf(round.getApplication().getJobProfile().getId()));
                res.setDriveTitle(round.getApplication().getJobProfile().getTitle());
                res.setRole(round.getApplication().getJobProfile().getTitle());
                if (round.getApplication().getJobProfile().getCompany() != null) {
                    res.setCompanyName(round.getApplication().getJobProfile().getCompany().getName());
                }
            }
            
            // Map application status to result
            String status = round.getApplication().getStatus().name().toLowerCase();
            if (status.equals("selected") || status.equals("offer")) {
                res.setResult("selected");
            } else if (status.equals("rejected")) {
                res.setResult("rejected");
            } else {
                res.setResult("pending");
            }
        }
        
        if (round.getScheduledTime() != null) {
            res.setDate(round.getScheduledTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            res.setTime(round.getScheduledTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        }
        
        res.setMode(round.getInterviewMode());
        res.setLink(round.getInterviewLink());
        res.setFeedback(round.getFeedback());
        
        return res;
    }
}
