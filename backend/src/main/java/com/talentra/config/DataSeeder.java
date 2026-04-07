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
            "Backend Engineer", List.of("Java", "Spring Boot", "PostgreSQL", "Redis"),
            "Frontend Engineer", List.of("React", "TypeScript", "Tailwind CSS", "Redux"),
            "ML Engineer", List.of("Python", "PyTorch", "Scikit-Learn", "Pandas"),
            "DevOps Engineer", List.of("Docker", "Kubernetes", "GitHub Actions", "Terraform"),
            "Fullstack Developer", List.of("Next.js", "Node.js", "Prisma", "AWS"),
            "Data Analyst", List.of("SQL", "PowerBI", "Python", "Excel"),
            "Cybersecurity Analyst", List.of("Nmap", "Wireshark", "Metasploit", "Linux"),
            "Blockchain Developer", List.of("Solidity", "Ethereum", "Web3.js", "Smart Contracts"));

    private final List<String> DEPARTMENTS = List.of(
            "Computer Science", "IT", "AI & Data Science", "Cyber Security", "Blockchain Technology", "Electronics");

    private final List<String> LOCATIONS = List.of(
            "Bangalore", "Hyderabad", "Pune", "Remote", "Noida", "Chennai", "Mumbai");

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
        jdbcTemplate.execute(
                "TRUNCATE TABLE interview_rounds, applications, job_profiles, student_profiles, companies, users RESTART IDENTITY CASCADE");
    }

    // ================= COMPANIES =================
    private List<Company> seedCompanies() {
        return List.of(
                createCompany("Google", "google.com", "Big Tech", "Cloud, Search, AI",
                        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"),
                createCompany("Microsoft", "microsoft.com", "Software", "Windows, Azure, Office",
                        "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"),
                createCompany("Amazon", "amazon.com", "E-commerce", "AWS, Logistics, Retail",
                        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"),
                createCompany("Meta", "meta.com", "Social Media", "Facebook, Instagram, VR",
                        "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"),
                createCompany("Netflix", "netflix.com", "Entertainment", "Streaming, Production",
                        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"),
                createCompany("Stripe", "stripe.com", "Fintech", "Payments, Banking Infrastructure",
                        "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"),
                createCompany("Tesla", "tesla.com", "Automotive", "Electric Vehicles, Clean Energy",
                        "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg"),
                createCompany("OpenAI", "openai.com", "AI Research", "GPT-4, DALL-E, Sora",
                        "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg"),
                createCompany("Chainlink", "chainlink.io", "Web3", "Oracle Networks, Smart Contracts",
                        "https://cryptologos.cc/logos/chainlink-link-logo.svg"),
                createCompany("CrowdStrike", "crowdstrike.com", "Cybersecurity", "Endpoint Protection, Threat Intel",
                        "https://upload.wikimedia.org/wikipedia/commons/d/d7/CrowdStrike_Logo.svg"));
    }

    private Company createCompany(String name, String domain, String industry, String description, String logoUrl) {
        Company c = new Company();
        c.setName(name);
        c.setIndustry(industry);
        c.setDescription(description);
        c.setWebsite("https://" + domain);
        c.setContactEmail("hr@" + domain);
        c.setLogo(logoUrl);
        c = companyRepo.save(c);

        createUser(name + " Recruiter", "hr@" + domain, "1234", Role.RECRUITER);
        return c;
    }

    // ================= JOBS =================
    private List<JobProfile> seedJobs(List<Company> companies) {
        List<JobProfile> jobs = new ArrayList<>();
        List<String> roles = new ArrayList<>(ROLE_SKILLS.keySet());

        for (Company c : companies) {
            int numJobs = 1 + random.nextInt(3);
            for (int i = 0; i < numJobs; i++) {
                String role = roles.get(random.nextInt(roles.size()));
                double minCgpa = 6.0 + (random.nextDouble() * 2.5);
                double salary = 600000 + (random.nextInt(15) * 100000);
                jobs.add(createJob(role, c, minCgpa, salary));
            }
        }

        // Add a few extremely high requirement jobs
        Company google = companies.get(0);
        jobs.add(createJob("Principal Researcher", google, 9.5, 4500000));

        // Add a few low requirement jobs
        Company amazon = companies.get(2);
        jobs.add(createJob("Support Associate", amazon, 5.0, 400000));

        return jobRepo.saveAll(jobs);
    }

    private JobProfile createJob(String role, Company c, double cgpa, double salary) {
        JobProfile j = new JobProfile();
        j.setTitle(role);
        j.setCompany(c);
        j.setMinCgpa(Math.round(cgpa * 10.0) / 10.0);
        j.setSalary(salary);
        j.setLocation(LOCATIONS.get(random.nextInt(LOCATIONS.size())));
        j.setRequirements(String.join(", ", ROLE_SKILLS.getOrDefault(role, List.of("Teamwork", "Communication"))));
        j.setMaxBacklogs(random.nextInt(2)); // 0 or 1 backlog allowed

        // Allowed departments (1 to 3 departments)
        int numDeps = 1 + random.nextInt(3);
        List<String> deps = new ArrayList<>(DEPARTMENTS);
        Collections.shuffle(deps);
        j.setAllowedDepartments(String.join(", ", deps.subList(0, numDeps)));

        j.setPostedAt(LocalDateTime.now().minusDays(random.nextInt(60)));
        return j;
    }

    // ================= STUDENTS =================
    private List<StudentProfile> seedStudents() {
        List<StudentProfile> students = new ArrayList<>();

        // 1. Seed Edge Case Students
        students.add(createStudent("Placed Star", "star@mail.com", 9.8, 0, "Computer Science", 2026,
                "Java, Spring Boot, AWS, Next.js"));
        students.add(createStudent("Unplaced Struggling", "struggling@mail.com", 6.2, 3, "Electronics", 2026,
                "Python, Basic Electronics"));
        students.add(createStudent("Active Interviewee", "active@mail.com", 8.5, 0, "IT", 2026,
                "React, Node.js, TypeScript"));
        students.add(createStudent("Rejected Aspirant", "rejected@mail.com", 7.5, 1, "Computer Science", 2026,
                "SQL, PowerBI, Excel"));
        students.add(createStudent("Zero Apps Student", "zero@mail.com", 7.0, 0, "AI & Data Science", 2027,
                "Python, Machine Learning"));

        // 2. Seed Random Students
        for (int i = 1; i <= STUDENT_COUNT - 5; i++) {
            double cgpa = 5.0 + (random.nextDouble() * 5.0); // 5.0 to 10.0
            int backlogs = random.nextInt(5) == 0 ? random.nextInt(4) : 0;
            String dept = DEPARTMENTS.get(random.nextInt(DEPARTMENTS.size()));
            int gradYear = 2024 + random.nextInt(4);

            students.add(createStudent(
                    "Student " + i,
                    "student" + i + "@mail.com",
                    cgpa,
                    backlogs,
                    dept,
                    gradYear,
                    String.join(", ", ROLE_SKILLS
                            .get(new ArrayList<>(ROLE_SKILLS.keySet()).get(random.nextInt(ROLE_SKILLS.size()))))));
        }

        return students;
    }

    private StudentProfile createStudent(String name, String email, double cgpa, int backlogs, String dept,
            int gradYear, String skills) {
        User u = createUser(name, email, "1234", Role.STUDENT);

        StudentProfile s = new StudentProfile();
        s.setUser(u);
        s.setDepartment(dept);
        s.setCgpa(Math.round(cgpa * 10.0) / 10.0);
        s.setBacklogs(backlogs);
        s.setPhone("9" + String.format("%09d", random.nextInt(1000000000)));
        s.setGraduationYear(gradYear);
        s.setSkills(skills);
        return studentRepo.save(s);
    }

    // ================= APPLICATIONS =================
    private void seedApplications(List<StudentProfile> students, List<JobProfile> jobs) {
        for (StudentProfile s : students) {
            // Edge Case: Zero Apps Student
            if (s.getUser().getEmail().equals("zero@mail.com"))
                continue;

            List<JobProfile> eligibleJobs = jobs.stream()
                    .filter(j -> s.getCgpa() >= j.getMinCgpa() && s.getBacklogs() <= j.getMaxBacklogs())
                    .toList();

            if (eligibleJobs.isEmpty())
                continue;

            int appsToCreate;
            String email = s.getUser().getEmail();
            if (email.equals("star@mail.com"))
                appsToCreate = Math.min(eligibleJobs.size(), 8);
            else if (email.equals("struggling@mail.com"))
                appsToCreate = Math.min(eligibleJobs.size(), 2);
            else
                appsToCreate = 2 + random.nextInt(4);

            List<JobProfile> shuffledJobs = new ArrayList<>(eligibleJobs);
            Collections.shuffle(shuffledJobs);

            for (int i = 0; i < Math.min(appsToCreate, shuffledJobs.size()); i++) {
                JobProfile j = shuffledJobs.get(i);
                Application app = new Application();
                app.setStudentProfile(s);
                app.setJobProfile(j);
                app.setAppliedAt(j.getPostedAt().plusDays(random.nextInt(5) + 1));
                if (app.getAppliedAt().isAfter(LocalDateTime.now()))
                    app.setAppliedAt(LocalDateTime.now().minusHours(1));

                // Status Logic
                if (email.equals("star@mail.com") && i < 3) {
                    app.setStatus(ApplicationStatus.OFFER);
                } else if (email.equals("rejected@mail.com")) {
                    app.setStatus(ApplicationStatus.REJECTED);
                } else if (email.equals("active@mail.com")) {
                    app.setStatus(ApplicationStatus.INTERVIEW);
                } else {
                    double rand = random.nextDouble();
                    if (rand < 0.2)
                        app.setStatus(ApplicationStatus.REJECTED);
                    else if (rand < 0.4)
                        app.setStatus(ApplicationStatus.SHORTLISTED);
                    else if (rand < 0.6)
                        app.setStatus(ApplicationStatus.INTERVIEW);
                    else if (rand < 0.7)
                        app.setStatus(ApplicationStatus.SELECTED);
                    else if (rand < 0.8)
                        app.setStatus(ApplicationStatus.OFFER);
                    else
                        app.setStatus(ApplicationStatus.APPLIED);
                }

                app = appRepo.save(app);

                if (app.getStatus() != ApplicationStatus.APPLIED) {
                    createInterviewFlow(app);
                }
            }
        }
    }

    private final List<String> FEEDBACK_SAMPLES = List.of(
            "Excellent technical knowledge and problem-solving skills.",
            "Strong communication and clear explanation of concepts.",
            "Demonstrated good understanding of the core architecture.",
            "Need to improve on specific domain knowledge but overall a positive candidate.",
            "Very enthusiastic and fits well with our company culture.",
            "Solid experience with the required tech stack. Highly recommended.",
            "Problem-solving approach was logical and efficient.",
            "Great team player attitude and leadership potential shown.",
            "Could sharpen coding speed, but code quality is high.",
            "Clear and concise answers, showed great confidence.");

    private void createInterviewFlow(Application app) {
        int rounds = 1 + random.nextInt(3);
        if (app.getStatus() == ApplicationStatus.OFFER)
            rounds = 3;

        for (int i = 1; i <= rounds; i++) {
            InterviewStatus status;
            int daysOffset;

            if (i < rounds) {
                status = InterviewStatus.COMPLETED;
                daysOffset = -10 + i * 2;
            } else {
                // Final round
                if (app.getStatus() == ApplicationStatus.REJECTED) {
                    status = InterviewStatus.COMPLETED;
                    daysOffset = -1;
                } else if (app.getStatus() == ApplicationStatus.OFFER
                        || app.getStatus() == ApplicationStatus.SHORTLISTED
                        || app.getStatus() == ApplicationStatus.INTERVIEW
                        || app.getStatus() == ApplicationStatus.SELECTED) {
                    double r = random.nextDouble();
                    if (r < 0.1)
                        status = InterviewStatus.CANCELLED;
                    else if (r < 0.6)
                        status = InterviewStatus.SCHEDULED;
                    else
                        status = InterviewStatus.COMPLETED;

                    daysOffset = (status == InterviewStatus.SCHEDULED) ? random.nextInt(10) : -random.nextInt(5);
                } else {
                    status = InterviewStatus.SCHEDULED;
                    daysOffset = random.nextInt(5);
                }
            }

            String mode = (i % 2 == 0) ? "offline" : "online";
            InterviewRound round = round(app, i, mode, daysOffset);
            round.setStatus(status);

            // Add feedback for completed interviews
            if (status == InterviewStatus.COMPLETED) {
                round.setFeedback(FEEDBACK_SAMPLES.get(random.nextInt(FEEDBACK_SAMPLES.size())));
            }

            interviewRepo.save(round);
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
                : "Block " + (char) ('A' + random.nextInt(5)) + ", Room " + (100 + random.nextInt(400)));
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