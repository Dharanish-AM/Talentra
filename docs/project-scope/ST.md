# Software Testing (ST) - Talentra

This document defines the test strategy and specific test cases to ensure the "Application Process", "Filtering Logic", and "Interview Scheduling" are reliable.

## 1. Test Execution Plan

- **Unit Testing**: JUnit 5 + Mockito for testing backend services and controllers. Focus on `ApplicationService` for eligibility logic.
- **Integration Testing**: API validation using tools like Postman or automated REST controllers tests.
- **UI Testing**: Comprehensive manual testing of Student, Admin, and Recruiter flows.
- **Load Testing**: Simulating high-traffic application spikes using JMeter or similar tools.

## 2. Test Case Scenarios

### 2.1. Application & Filtering Logic (AFL)

| ID | Description | Input Data | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :---: |
| **TC-AFL-01** | **Eligible Application** | CGPA: 9.0, Backlogs: 0, Dept: CS. Job Min CGPA: 8.0, Max Backlogs: 1, Allowed Depts: CS, IT. | Application saved successfully; Status: `APPLIED`. | ✅ Pass |
| **TC-AFL-02** | **Ineligible CGPA** | CGPA: 7.5, Job Min CGPA: 8.0 | Application blocked; "Insufficient CGPA" exception. | ✅ Pass |
| **TC-AFL-03** | **Ineligible Backlogs**| Backlogs: 2, Job Max Backlogs: 1 | Application blocked; "High backlog count" exception. | ✅ Pass |
| **TC-AFL-04** | **Ineligible Dept** | Dept: Mechanical, Job Allowed Depts: CS, AI | Application blocked; "Department not eligible" exception. | ✅ Pass |

### 2.2. Shortlisting & Interview Scheduling (SIS)

| ID | Description | Scenario | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :---: |
| **TC-SIS-01** | **Interview Flow** | Move student from `SHORTLISTED` to `OFFERED`. | Application status and Interview round result synchronized. | ✅ Pass |
| **TC-SIS-02** | **Link Assignment** | Assign a meeting link to an Online interview. | Link persists and is visible to the student. | ✅ Pass |
| **TC-SIS-03** | **Conflict Prevention**| Assign overlapping slots to same student/interviewer. | System prevents or warns about scheduling conflicts. | ✅ Pass |

## 3. Automated Backend Tests

We have implemented JUnit test cases in `ApplicationServiceTest.java` to validate TC-AFL-01 through TC-AFL-04 using Mockito for dependency isolation.

```java
@Test
void testApplyInsufficientCgpa() {
    StudentProfile student = createStudent(7.5, 0, "CS");
    JobProfile job = createJob(8.0, 1, "CS");
    ApplicationRequest request = createRequest(1L, 1L);

    when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(student));
    when(jobProfileRepository.findById(1L)).thenReturn(Optional.of(job));

    RuntimeException exception = assertThrows(RuntimeException.class, () -> 
        applicationService.applyToJob(request)
    );
    assertTrue(exception.getMessage().contains("CGPA"));
}
```
