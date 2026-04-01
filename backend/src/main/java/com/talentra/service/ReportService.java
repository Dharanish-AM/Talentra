package com.talentra.service;

import com.talentra.repository.ApplicationRepository;
import com.talentra.repository.JobProfileRepository;
import com.talentra.repository.StudentProfileRepository;
import com.talentra.entity.ApplicationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobProfileRepository jobRepository;

    @Autowired
    private StudentProfileRepository studentRepository;

    public Map<String, Object> getPlacementStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalJobOffers", applicationRepository.findByStatus(ApplicationStatus.OFFERED).size());
        stats.put("activeJobProfiles", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        return stats;
    }

    public byte[] generateExportReport() {
        StringBuilder csv = new StringBuilder();
        csv.append("Student Name,Job Profile,Company,Status,Applied At\n");
        
        applicationRepository.findAll().forEach(app -> {
            csv.append(app.getStudentProfile().getUser().getName()).append(",")
               .append(app.getJobProfile().getTitle()).append(",")
               .append(app.getJobProfile().getCompany().getName()).append(",")
               .append(app.getStatus()).append(",")
               .append(app.getAppliedAt()).append("\n");
        });
        
        return csv.toString().getBytes();
    }
}
