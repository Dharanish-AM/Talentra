package com.talentra.service;

import com.talentra.dto.StudentProfileRequest;
import com.talentra.entity.StudentProfile;
import com.talentra.entity.User;
import com.talentra.repository.StudentProfileRepository;
import com.talentra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public StudentProfile getStudentProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student Profile not found"));
    }

    public StudentProfile createOrUpdateProfile(Long userId, StudentProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElse(new StudentProfile());

        profile.setUser(user);
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment());
        if (request.getCgpa() != null) profile.setCgpa(request.getCgpa());
        if (request.getBacklogs() != null) profile.setBacklogs(request.getBacklogs());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear());
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            profile.setSkills(String.join(", ", request.getSkills()));
        } else if (request.getSkills() != null) {
            profile.setSkills("");
        }
        if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl());

        return studentProfileRepository.save(profile);
    }
}
