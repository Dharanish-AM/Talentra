# Software Testing (ST) - Talentra

This document defines the test strategy and specific test cases to ensure the "Application Process", "Filtering Logic", and "Interview Scheduling" are reliable.

## 1. Test Execution Plan
- **Unit Testing**: JUnit 5 + Mockito for testing backend services and controllers.
- **Integration Testing**: Postman collections for API validation.
- **UI Testing**: Manual exploratory testing of the Student and Admin portals.
- **Load Testing**: Simulating 300+ concurrent applications using JMeter.

## 2. Test Case Scenarios

### 2.1. Application & Filtering Logic (AFL)

| ID | Description | Input Data | Expected Result | Result |
|:---|:---|:---|:---|:---:|
| **TC-AFL-01** | **Eligible Application** | CGPA: 9.0, Backlogs: 0, Dept: CS. Job Min CGPA: 8.0, Max Backlogs: 1, Allowed Depts: CS, IT. | Application saved successfully; Status: `APPLIED`. | ✅ Pass |
| **TC-AFL-02** | **Ineligible CGPA** | CGPA: 7.5, Job Min CGPA: 8.0 | Application blocked; "Insufficient CGPA" error. | ✅ Pass |
| **TC-AFL-03** | **Ineligible Backlogs**| Backlogs: 2, Job Max Backlogs: 1 | Application blocked; "High Backlog count" error. | ✅ Pass |
| **TC-AFL-04** | **Ineligible Dept** | Dept: Mechanical, Job Allowed Depts: CS, AI | Application blocked; "Department not eligible". | ✅ Pass |

### 2.2. Shortlisting & Interview Scheduling (SIS)

| ID | Description | Scenario | Expected Result | Result |
|:---|:---|:---|:---|:---:|
| **TC-SIS-01** | **Bulk Shortlist** | Select 10 applicants and set status to `SHORTLISTED`. | All 10 applicants updated; Email notifications triggered. | ✅ Pass |
| **TC-SIS-02** | **Schedule Conflict** | Assign an interviewer to two overlapping time slots. | System warns about conflict or prevents scheduling. | ✅ Pass |
| **TC-SIS-03** | **Status Flow** | Move student from `SHORTLISTED` to `OFFERED`. | Application status and Interview round result synchronized. | ✅ Pass |

## 3. Automated Backend Tests

We have implemented JUnit test cases in `ApplicationServiceTest.java` to validate TC-AFL-01 through TC-AFL-04.

```java
// Logic snippet from ApplicationServiceTest
@Test
void testIneligibleCgpaApplication() {
    JobProfile job = mockJob(8.0, 0, "CS");
    StudentProfile student = mockStudent(7.5, 0, "CS");
    
    assertThrows(IneligibleException.class, () -> 
        applicationService.applyToJob(request(student, job))
    );
}
```
