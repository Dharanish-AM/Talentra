package com.talentra.dto;

import com.talentra.entity.InterviewRound;
import lombok.Data;
import java.time.format.DateTimeFormatter;

@Data
public class InterviewResponse {
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

    public static InterviewResponse fromEntity(InterviewRound round) {
        InterviewResponse resp = new InterviewResponse();
        resp.setId(round.getId().toString());
        resp.setDriveId(round.getApplication().getJobProfile().getId().toString());
        resp.setStudentId(round.getApplication().getStudentProfile().getUser().getId().toString());
        resp.setStudentName(round.getApplication().getStudentProfile().getUser().getName());
        resp.setStudentEmail(round.getApplication().getStudentProfile().getUser().getEmail());
        resp.setDriveTitle(round.getApplication().getJobProfile().getTitle());
        resp.setCompanyName(round.getApplication().getJobProfile().getCompany().getName());
        resp.setRole(round.getApplication().getJobProfile().getTitle());
        
        if (round.getScheduledTime() != null) {
            resp.setDate(round.getScheduledTime().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
            resp.setTime(round.getScheduledTime().format(DateTimeFormatter.ofPattern("hh:mm a")));
        }
        
        resp.setMode(round.getInterviewMode() != null ? round.getInterviewMode() : "online");
        resp.setLink(round.getInterviewLink());
        resp.setFeedback(round.getFeedback());
        
        // Map status to frontend 'result'
        switch(round.getStatus()) {
            case COMPLETED: resp.setResult("selected"); break;
            case CANCELLED: resp.setResult("rejected"); break;
            default: resp.setResult("pending");
        }
        
        return resp;
    }
}
