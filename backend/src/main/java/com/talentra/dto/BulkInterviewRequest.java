package com.talentra.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkInterviewRequest {
    private List<InterviewRequest> interviews;
}
