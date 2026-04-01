package com.talentra.config;

import com.talentra.entity.*;
import com.talentra.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final CompanyRepository companyRepo;
    private final JobProfileRepository jobRepo;
    private final StudentProfileRepository studentRepo;
    private final ApplicationRepository appRepo;
    private final InterviewRoundRepository interviewRepo;
    private final PasswordEncoder encoder;

    // ================= CONFIG =================
    private static final int STUDENT_COUNT = 300;

    private final Map<String, List<String>> ROLE_SKILLS = Map.of(
            "Backend Engineer", List.of("Java", "Spring Boot", "SQL"),
            "Frontend Engineer", List.of("React", "JavaScript", "CSS"),
            "ML Engineer", List.of("Python", "Machine Learning", "TensorFlow"),
            "DevOps Engineer", List.of("Docker", "Kubernetes", "AWS")
    );

    private final List<String> DEPARTMENTS = List.of(
            "Computer Science", "IT", "AI", "Data Science"
    );

    // ================= ENTRY =================
    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            System.out.println("⚠️ Data already exists. Skipping seeding.");
            return;
        }

        System.out.println("🚀 Starting production data seeding...");

        createAdmin();
        List<Company> companies = seedCompanies();
        List<JobProfile> jobs = seedJobs(companies);
        List<StudentProfile> students = seedStudents();
        seedApplications(students, jobs);

        System.out.println("✅ Production data seeding completed");
    }

    // ================= ADMIN =================
    private void createAdmin() {
        createUser("Admin", "admin@talentra.com", "admin123", Role.ADMIN);
    }

    // ================= COMPANIES =================
    private List<Company> seedCompanies() {
        return List.of(
                createCompany("Google", "google.com"),
                createCompany("Microsoft", "microsoft.com"),
                createCompany("Amazon", "amazon.com"),
                createCompany("Adobe", "adobe.com"),
                createCompany("Salesforce", "salesforce.com")
        );
    }

    private Company createCompany(String name, String domain) {
        Company c = new Company();
        c.setName(name);
        c.setIndustry("Technology");
        c.setWebsite("https://" + domain);
        c.setContactEmail("hr@" + domain);
        c = companyRepo.save(c);

        createUser(name + " Recruiter", "hr@" + domain, "1234", Role.RECRUITER);
        return c;
    }

    // ================= JOBS =================
    private List<JobProfile> seedJobs(List<Company> companies) {
        List<JobProfile> jobs = new ArrayList<>();

        for (Company c : companies) {
            jobs.add(createJob("Backend Engineer", c, 7.0, 1200000));
            jobs.add(createJob("Frontend Engineer", c, 6.5, 1000000));
            jobs.add(createJob("ML Engineer", c, 8.0, 1500000));
        }

        return jobRepo.saveAll(jobs);
    }

    private JobProfile createJob(String role, Company c, double cgpa, double salary) {
        JobProfile j = new JobProfile();
        j.setTitle(role);
        j.setCompany(c);
        j.setMinCgpa(cgpa);
        j.setSalary(salary);
        j.setLocation("Bangalore");
        j.setRequirements(String.join(", ", ROLE_SKILLS.get(role)));
        j.setPostedAt(LocalDateTime.now());
        return j;
    }

    // ================= STUDENTS =================
    private List<StudentProfile> seedStudents() {
        List<StudentProfile> students = new ArrayList<>();

        for (int i = 1; i <= STUDENT_COUNT; i++) {
            double cgpa = generateCgpa(i);

            List<String> skills = assignSkills(cgpa);

            User u = createUser(
                    "Student" + i,
                    "student" + i + "@mail.com",
                    "1234",
                    Role.STUDENT
            );

            StudentProfile s = new StudentProfile();
            s.setUser(u);
            s.setDepartment(DEPARTMENTS.get(i % DEPARTMENTS.size()));
            s.setCgpa(cgpa);
            s.setSkills(String.join(", ", skills));
            s.setResumeUrl("https://resumes/student" + i + ".pdf");

            students.add(s);
        }

        return studentRepo.saveAll(students);
    }

    // CGPA distribution (realistic)
    private double generateCgpa(int i) {
        if (i <= 50) return 9.0 + (i % 10) * 0.05;     // Top tier
        if (i <= 150) return 7.5 + (i % 10) * 0.1;     // Mid tier
        return 6.0 + (i % 10) * 0.1;                   // Low tier
    }

    // Skill assignment based on CGPA
    private List<String> assignSkills(double cgpa) {
        if (cgpa >= 9) return ROLE_SKILLS.get("ML Engineer");
        if (cgpa >= 7.5) return ROLE_SKILLS.get("Backend Engineer");
        return ROLE_SKILLS.get("Frontend Engineer");
    }

    // ================= APPLICATIONS =================
    private void seedApplications(List<StudentProfile> students, List<JobProfile> jobs) {

        for (StudentProfile s : students) {
            for (JobProfile j : jobs) {

                if (!isEligible(s, j)) continue;

                Application app = new Application();
                app.setStudentProfile(s);
                app.setJobProfile(j);
                app.setAppliedAt(LocalDateTime.now());

                // Decision logic
                if (s.getCgpa() >= j.getMinCgpa() + 1) {
                    app.setStatus(ApplicationStatus.OFFERED);
                    app = appRepo.save(app);
                    createInterviewFlow(app);
                } else if (s.getCgpa() >= j.getMinCgpa()) {
                    app.setStatus(ApplicationStatus.SHORTLISTED);
                    app = appRepo.save(app);
                    createInterviewFlow(app);
                } else {
                    app.setStatus(ApplicationStatus.REJECTED);
                    appRepo.save(app);
                }
            }
        }
    }

    // Eligibility logic
    private boolean isEligible(StudentProfile s, JobProfile j) {
        if (s.getCgpa() < j.getMinCgpa()) return false;

        List<String> studentSkills = Arrays.asList(s.getSkills().split(", "));
        for (String req : j.getRequirements().split(", ")) {
            if (studentSkills.contains(req)) return true;
        }
        return false;
    }

    // ================= INTERVIEW =================
    private void createInterviewFlow(Application app) {

        interviewRepo.save(round(app, 1, "online", 2));
        interviewRepo.save(round(app, 2, "online", 4));

        if (app.getStatus() == ApplicationStatus.OFFERED) {
            interviewRepo.save(round(app, 3, "offline", 6));
        }
    }

    private InterviewRound round(Application app, int num, String mode, int days) {
        InterviewRound r = new InterviewRound();
        r.setApplication(app);
        r.setRoundNumber(num);
        r.setInterviewMode(mode);
        r.setScheduledTime(LocalDateTime.now().plusDays(days));
        r.setStatus(InterviewStatus.SCHEDULED);
        r.setInterviewLink(mode.equals("online")
                ? "https://meet.google.com/" + UUID.randomUUID()
                : "Room " + num);
        return r;
    }

    // ================= USER =================
    private User createUser(String name, String email, String pass, Role role) {
        return userRepo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setPassword(encoder.encode(pass));
            u.setRole(role);
            return userRepo.save(u);
        });
    }
}