package com.talentra.dto;

import lombok.Data;

@Data
public class CompanyRequest {
    private String name;
    private String industry;
    private String logo;
    private String description;
    private String website;
    private String contactEmail;
}
