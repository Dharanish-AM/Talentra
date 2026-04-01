package com.talentra.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterviewRequest {
    private Long applicationId;
    private Integer roundNumber;
    private LocalDateTime scheduledTime;
    private String interviewLink;
}
