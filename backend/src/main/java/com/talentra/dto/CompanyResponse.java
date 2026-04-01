package com.talentra.dto;

import com.talentra.entity.Company;
import lombok.Data;

@Data
public class CompanyResponse {
    private String id;
    private String name;
    private String industry;
    private String logo;
    private String website;
    private String description;

    public static CompanyResponse fromEntity(Company company) {
        CompanyResponse resp = new CompanyResponse();
        resp.setId(company.getId().toString());
        resp.setName(company.getName());
        resp.setIndustry(company.getIndustry() != null ? company.getIndustry() : "Technology");
        resp.setLogo(company.getLogo());
        resp.setWebsite(company.getWebsite());
        resp.setDescription(company.getDescription());
        return resp;
    }
}
