package com.talentra.service;

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

    public StudentProfile createOrUpdateProfile(Long userId, StudentProfile profileDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElse(new StudentProfile());

        profile.setUser(user);
        if (profileDetails.getDepartment() != null) profile.setDepartment(profileDetails.getDepartment());
        if (profileDetails.getCgpa() != null) profile.setCgpa(profileDetails.getCgpa());
        if (profileDetails.getSkills() != null) profile.setSkills(profileDetails.getSkills());
        if (profileDetails.getResumeUrl() != null) profile.setResumeUrl(profileDetails.getResumeUrl());

        return studentProfileRepository.save(profile);
    }
}
