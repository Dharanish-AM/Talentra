package com.talentra.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkActionRequest {
    private List<Long> applicationIds;
}
