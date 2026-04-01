package com.talentra.service;

import com.talentra.entity.JobProfile;
import com.talentra.entity.Company;
import com.talentra.repository.JobProfileRepository;
import com.talentra.repository.CompanyRepository;
import com.talentra.dto.JobProfileRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobProfileRepository jobProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public JobProfile createJobProfile(JobProfileRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        JobProfile jobProfile = new JobProfile();
        jobProfile.setTitle(request.getTitle());
        jobProfile.setDescription(request.getDescription());
        jobProfile.setRequirements(request.getRequirements());
        jobProfile.setSalary(request.getSalary());
        jobProfile.setLocation(request.getLocation());
        jobProfile.setCompany(company);

        return jobProfileRepository.save(jobProfile);
    }

    public List<JobProfile> getAllJobProfiles() {
        return jobProfileRepository.findAll();
    }

    public JobProfile getJobProfileById(Long id) {
        return jobProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Profile not found"));
    }
}
