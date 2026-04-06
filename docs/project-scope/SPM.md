# Software Project Management (SPM) - Talentra

This document plans the resource management and risk mitigation for the Talentra project, especially during peak recruitment seasons.

## 1. Resource Allocation

### Human Resources
- **Placement Officers (4)**: Focused on coordinating with companies, managing drive launches, and final shortlisting.
- **Company Recruiters (Variable)**: Responsible for posting job profiles and conducting interviews.
- **System Administrators (2)**: Monitoring server health and handling database operations.
- **Student Volunteers (10)**: Assisting in manual physical interview coordination and document verification.

### Physical & Infrastructure Resources
- **Application Servers**: 4 High-CPU instances (e.g., AWS EC2 t3.large) to handle concurrent requests.
- **Database Server**: Managed MongoDB (e.g., MongoDB Atlas) with auto-scaling to handle student application spikes.
- **Storage**: AWS S3 / Azure Blob Storage for secure hosting of student resumes (PDF).
- **Interview Rooms**: 10 Physical rooms with video conferencing equipment for hybrid rounds.

## 2. Risk Management & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|:-----|:-----------:|:------:|:--------------------|
| **High Traffic Spikes** (Drive launches) | High | High | Implement **Express Rate Limit** or Nginx-level throttling. Use **Redis Caching** for job listings. Horizontal scaling of backend services during "Rush Hours" (e.g., 9 AM - 12 PM). |
| **Concurrent Interview Scheduling** | Medium | Medium | Implement a distributed locking mechanism to prevent triple-booking an interviewer or a student. Use asynchronous task queues for notification delivery. |
| **Database Performance Degrades** | Medium | High | Index primary fields (`jobProfileId`, `studentProfileId`, `status`) in the Application collection. Perform seasonal data purging (archiving old drives). |
| **Incomplete Student Profiles** | High | Low | Implement mandatory field validation and progress tracking on the Student Dashboard. Auto-save profile drafts. |

### Critical Risk: "The Flash Sale Problem"
When a Tier-1 company (e.g., Google, Microsoft) launches a drive, 300+ students might apply within minutes.
- **Mitigation**: Move the eligibility filtering logic from the Web Layer to the **Service Layer** with high performance. Use Message Queues (e.g., RabbitMQ/Kafka) to process "One-Click Apply" requests asynchronously if volume exceeds thresholds.
