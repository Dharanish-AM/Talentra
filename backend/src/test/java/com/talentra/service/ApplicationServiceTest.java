package com.talentra.service;

import com.talentra.dto.ApplicationRequest;
import com.talentra.entity.*;
import com.talentra.repository.ApplicationRepository;
import com.talentra.repository.JobProfileRepository;
import com.talentra.repository.StudentProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private JobProfileRepository jobProfileRepository;

    @InjectMocks
    private ApplicationService applicationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testApplySuccessful() {
        StudentProfile student = createStudent(9.0, 0, "CS");
        JobProfile job = createJob(8.0, 1, "CS, IT");
        ApplicationRequest request = createRequest(1L, 1L);

        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobProfileRepository.findById(1L)).thenReturn(Optional.of(job));
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> i.getArguments()[0]);

        Application result = applicationService.applyToJob(request);

        assertNotNull(result);
        assertEquals(ApplicationStatus.APPLIED, result.getStatus());
        verify(applicationRepository, times(1)).save(any(Application.class));
    }

    @Test
    void testApplyInsufficientCgpa() {
        StudentProfile student = createStudent(7.5, 0, "CS");
        JobProfile job = createJob(8.0, 1, "CS");
        ApplicationRequest request = createRequest(1L, 1L);

        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobProfileRepository.findById(1L)).thenReturn(Optional.of(job));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> applicationService.applyToJob(request));
        assertTrue(exception.getMessage().contains("CGPA"));
    }

    @Test
    void testApplyHighBacklogs() {
        StudentProfile student = createStudent(9.0, 2, "CS");
        JobProfile job = createJob(8.0, 1, "CS");
        ApplicationRequest request = createRequest(1L, 1L);

        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobProfileRepository.findById(1L)).thenReturn(Optional.of(job));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> applicationService.applyToJob(request));
        assertTrue(exception.getMessage().contains("backlog"));
    }

    @Test
    void testApplyIneligibleDept() {
        StudentProfile student = createStudent(9.0, 0, "Mechanical");
        JobProfile job = createJob(8.0, 1, "CS, IT");
        ApplicationRequest request = createRequest(1L, 1L);

        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobProfileRepository.findById(1L)).thenReturn(Optional.of(job));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> applicationService.applyToJob(request));
        assertTrue(exception.getMessage().contains("department"));
    }

    private StudentProfile createStudent(double cgpa, int backlogs, String dept) {
        StudentProfile s = new StudentProfile();
        s.setId(1L);
        s.setCgpa(cgpa);
        s.setBacklogs(backlogs);
        s.setDepartment(dept);
        return s;
    }

    private JobProfile createJob(double minCgpa, int maxBacklogs, String depts) {
        JobProfile j = new JobProfile();
        j.setId(1L);
        j.setMinCgpa(minCgpa);
        j.setMaxBacklogs(maxBacklogs);
        j.setAllowedDepartments(depts);
        return j;
    }

    private ApplicationRequest createRequest(Long studentId, Long jobId) {
        ApplicationRequest r = new ApplicationRequest();
        r.setStudentProfileId(studentId);
        r.setJobProfileId(jobId);
        return r;
    }
}
