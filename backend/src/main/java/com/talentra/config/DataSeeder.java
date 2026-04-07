package com.talentra.config;

import com.talentra.entity.*;
import com.talentra.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
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
    private final JdbcTemplate jdbcTemplate;

    private final Random random = new Random();

    // ================= CONFIG =================
    private static final int STUDENT_COUNT = 100;

    private final Map<String, List<String>> ROLE_SKILLS = Map.of(
            "Backend Engineer", List.of("Java", "Spring Boot", "SQL"),
            "Frontend Engineer", List.of("React", "JavaScript", "CSS"),
            "ML Engineer", List.of("Python", "Machine Learning", "TensorFlow"),
            "DevOps Engineer", List.of("Docker", "Kubernetes", "AWS"),
            "Fullstack Developer", List.of("React", "Node.js", "MongoDB"),
            "Data Analyst", List.of("Python", "Tableau", "SQL")
    );

    private final List<String> DEPARTMENTS = List.of(
            "Computer Science", "IT", "AI", "Data Science", "Cyber Security"
    );

    // ================= ENTRY =================
    @Override
    public void run(String... args) {
        System.out.println("🧹 Clearing existing database data...");
        clearData();

        System.out.println("👑 Creating default Admin account...");
        createUser("Admin", "admin@mail.com", "1234", Role.ADMIN);
        System.out.println("👑 Created: admin@mail.com / 1234");

        System.out.println("🚀 Starting neatly distributed data seeding based on current timeline (April 2026)...");

        List<Company> companies = seedCompanies();
        List<JobProfile> jobs = seedJobs(companies);
        List<StudentProfile> students = seedStudents();
        seedApplications(students, jobs);

        System.out.println("✅ Production data seeding completed successfully");
    }

    private void clearData() {
        jdbcTemplate.execute("TRUNCATE TABLE interview_rounds, applications, job_profiles, student_profiles, companies, users RESTART IDENTITY CASCADE");
    }

    // ================= COMPANIES =================
    private List<Company> seedCompanies() {
        return List.of(
                createCompany("Google", "google.com", "Technology", "Cloud, Search, AI"),
                createCompany("Microsoft", "microsoft.com", "Technology", "Software, Hardware, Cloud"),
                createCompany("Amazon", "amazon.com", "E-commerce", "Retail, AWS, Logistics"),
                createCompany("Meta", "meta.com", "Social Media", "Social Networking, VR, AI"),
                createCompany("Netflix", "netflix.com", "Entertainment", "Streaming, Production"),
                createCompany("Stripe", "stripe.com", "Fintech", "Payments, Banking Infrastructure"),
                createCompany("Tesla", "tesla.com", "Automotive", "Electric Vehicles, Energy"),
                createCompany("Adobe", "adobe.com", "Technology", "Creative Software, Marketing")
        );
    }

    private Company createCompany(String name, String domain, String industry, String description) {
        Company c = new Company();
        c.setName(name);
        c.setIndustry(industry);
        c.setDescription(description);
        c.setWebsite("https://" + domain);
        c.setContactEmail("hr@" + domain);
        c = companyRepo.save(c);
        
        createUser(name + " Recruiter", "hr@" + domain, "1234", Role.RECRUITER);
        return c;
    }

    // ================= JOBS =================
    private List<JobProfile> seedJobs(List<Company> companies) {
        List<JobProfile> jobs = new ArrayList<>();
        List<String> roles = new ArrayList<>(ROLE_SKILLS.keySet());

        for (Company c : companies) {
            // Each company posts 2-3 jobs
            int numJobs = 2 + random.nextInt(2);
            for (int i = 0; i < numJobs; i++) {
                String role = roles.get(random.nextInt(roles.size()));
                double minCgpa = 6.0 + (random.nextDouble() * 2.5); // 6.0 to 8.5
                double salary = 800000 + (random.nextInt(12) * 100000); // 8L to 20L
                jobs.add(createJob(role, c, minCgpa, salary));
            }
        }

        return jobRepo.saveAll(jobs);
    }

    private JobProfile createJob(String role, Company c, double cgpa, double salary) {
        JobProfile j = new JobProfile();
        j.setTitle(role);
        j.setCompany(c);
        j.setMinCgpa(Math.round(cgpa * 10.0) / 10.0);
        j.setSalary(salary);
        j.setLocation(random.nextBoolean() ? "Bangalore" : "Hyderabad");
        j.setRequirements(String.join(", ", ROLE_SKILLS.get(role)));
        // Posted 5 to 25 days ago
        j.setPostedAt(LocalDateTime.now().minusDays(5 + random.nextInt(20)));
        return j;
    }

    // ================= STUDENTS =================
    private List<StudentProfile> seedStudents() {
        List<StudentProfile> students = new ArrayList<>();

        for (int i = 1; i <= STUDENT_COUNT; i++) {
            double cgpa = 6.0 + (random.nextDouble() * 3.5); // 6.0 to 9.5
            cgpa = Math.round(cgpa * 10.0) / 10.0;

            User u = createUser(
                    "Student " + i,
                    "student" + i + "@mail.com",
                    "1234",
                    Role.STUDENT
            );

            StudentProfile s = new StudentProfile();
            s.setUser(u);
            s.setDepartment(DEPARTMENTS.get(random.nextInt(DEPARTMENTS.size())));
            s.setCgpa(cgpa);
            s.setBacklogs(random.nextInt(3) == 0 ? random.nextInt(2) : 0); // 33% chance of backlogs
            s.setPhone("9" + String.format("%09d", i));
            // Graduation year 2026, 2027, or 2028
            s.setGraduationYear(2026 + random.nextInt(3));
            
            // Assign skills based on department/interest
            List<String> allRoles = new ArrayList<>(ROLE_SKILLS.keySet());
            String randomRole = allRoles.get(random.nextInt(allRoles.size()));
            s.setSkills(String.join(", ", ROLE_SKILLS.get(randomRole)));

            students.add(s);
        }

        return studentRepo.saveAll(students);
    }

    // ================= APPLICATIONS =================
    private void seedApplications(List<StudentProfile> students, List<JobProfile> jobs) {
        for (StudentProfile s : students) {
            // Each student applies to 3-6 eligible jobs
            List<JobProfile> eligibleJobs = jobs.stream()
                    .filter(j -> s.getCgpa() >= j.getMinCgpa())
                    .toList();
            
            if (eligibleJobs.isEmpty()) continue;

            int appsToCreate = Math.min(eligibleJobs.size(), 3 + random.nextInt(4));
            Collections.shuffle(new ArrayList<>(eligibleJobs));
            
            for (int i = 0; i < appsToCreate; i++) {
                JobProfile j = eligibleJobs.get(i);
                Application app = new Application();
                app.setStudentProfile(s);
                app.setJobProfile(j);
                
                // Applied between job post and now (2-10 days ago)
                app.setAppliedAt(j.getPostedAt().plusDays(1 + random.nextInt(4)));
                if (app.getAppliedAt().isAfter(LocalDateTime.now())) {
                    app.setAppliedAt(LocalDateTime.now().minusHours(1));
                }

                // Random status assignment with logic
                double score = s.getCgpa() - j.getMinCgpa();
                if (score > 1.5) {
                    app.setStatus(ApplicationStatus.OFFERED);
                } else if (score > 0.8) {
                    app.setStatus(random.nextBoolean() ? ApplicationStatus.SHORTLISTED : ApplicationStatus.OFFERED);
                } else if (score < 0.3 && random.nextBoolean()) {
                    app.setStatus(ApplicationStatus.REJECTED);
                } else {
                    app.setStatus(ApplicationStatus.APPLIED);
                }

                app = appRepo.save(app);

                if (app.getStatus() == ApplicationStatus.SHORTLISTED || app.getStatus() == ApplicationStatus.OFFERED) {
                    createInterviewFlow(app);
                }
            }
        }
    }

    // ================= INTERVIEW =================
    private void createInterviewFlow(Application app) {
        // Round 1 (Past or Today)
        InterviewRound r1 = round(app, 1, "online", -2 + random.nextInt(3)); // -2 to 0 days from now
        r1.setStatus(InterviewStatus.COMPLETED);
        interviewRepo.save(r1);

        if (app.getStatus() == ApplicationStatus.OFFERED) {
            // Round 2 (Recent Past)
            InterviewRound r2 = round(app, 2, "online", -1);
            r2.setStatus(InterviewStatus.COMPLETED);
            interviewRepo.save(r2);
            
            // Round 3 (Today or Future)
            InterviewRound r3 = round(app, 3, "offline", 1 + random.nextInt(5));
            r3.setStatus(InterviewStatus.SCHEDULED);
            interviewRepo.save(r3);
        } else if (app.getStatus() == ApplicationStatus.SHORTLISTED) {
            // Next round scheduled in future
            InterviewRound r2 = round(app, 2, "online", 2 + random.nextInt(7));
            r2.setStatus(InterviewStatus.SCHEDULED);
            interviewRepo.save(r2);
        }
    }

    private InterviewRound round(Application app, int num, String mode, int daysFromNow) {
        InterviewRound r = new InterviewRound();
        r.setApplication(app);
        r.setRoundNumber(num);
        r.setInterviewMode(mode);
        r.setScheduledTime(LocalDateTime.now().plusDays(daysFromNow).withHour(10 + random.nextInt(7)));
        r.setStatus(InterviewStatus.SCHEDULED);
        r.setInterviewLink(mode.equals("online")
                ? "https://meet.google.com/" + UUID.randomUUID().toString().substring(0, 8)
                : "Block " + (char)('A' + random.nextInt(5)) + ", Room " + (100 + random.nextInt(400)));
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