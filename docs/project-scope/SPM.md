# Software Project Management (SPM) - Talentra

This document plans the resource management and risk mitigation for the Talentra project, especially during peak recruitment seasons.

## 1. Resource Allocation

### Human Resources

- **Placement Officers (4)**: Focused on coordinating with companies, managing drive launches, and final shortlisting.
- **Company Recruiters (Variable)**: Responsible for posting job profiles and conducting interviews.
- **System Administrators (2)**: Monitoring server health and handling database operations.
- **Student Volunteers (10)**: Assisting in manual physical interview coordination and document verification.

### Physical & Infrastructure Resources

- **Application Servers**: High-availability Spring Boot instances (e.g., AWS EC2 t3.large) to handle concurrent requests.
- **Database Server**: **PostgreSQL** with connection pooling and optimized indexing for heavy application loads.
- **Storage**: AWS S3 or similar for secure hosting of student resumes and profile attachments.
- **Interview Rooms**: Physical and virtual rooms (Google Meet/Teams) for hybrid recruitment rounds.

## 2. Risk Management & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **High Traffic Spikes** (Drive launches) | High | High | Implement **JWT-based rate limiting** and Nginx throttling. Use **Caffeine/Redis Caching** for frequently accessed job listings. |
| **Concurrent Interview Scheduling** | Medium | Medium | Use **Optimistic Locking** in JPA to prevent double-booking. Implement backend validation for overlapping time slots. |
| **Database Performance Degrades** | Medium | High | Apply composite indexing on `job_profile_id` and `student_profile_id` in the `applications` table. Monitor query execution plans. |
| **Data Integrity in Seeding** | Low | Low | Maintain a robust `DataSeeder` with unique constraints to ensure fresh, consistent environments during development and testing. |

### Critical Risk: "The Massive Drive Problem"

When a Tier-1 company launches a high-salary drive, application volume can spike instantaneously.
- **Mitigation**: Move eligibility filtering logic from the Web Layer to the **Service Layer** for performance. Ensure the `ApplicationService` handles eligibility checks atomically before persisting applications.
