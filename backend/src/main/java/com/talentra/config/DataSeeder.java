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

    private final Random random = new Random(42);

    // ================= CONFIG =================
    private static final int STUDENT_COUNT = 10;

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
        if (userRepo.count() > 0) {
            System.out.println("📦 Database already populated, skipping data seeding.");
            return;
        }

        System.out.println("🚀 Starting deterministic data seeding based on current timeline (April 2026)...");

        System.out.println("👑 Creating default Admin account...");
        createUser("Admin", "admin@mail.com", "1234", Role.ADMIN);
        System.out.println("👑 Created: admin@mail.com / 1234");

        List<Company> companies = seedCompanies();
        List<JobProfile> jobs = seedJobs(companies);
        List<StudentProfile> students = seedStudents();
        seedApplications(students, jobs);

        System.out.println("✅ Production data seeding completed successfully");
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
                createCompany("OpenAI", "openai.com", "AI Research", "GPT-4, DALL-E, Sora",
                        "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg"));
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
            int numJobs = 1 + random.nextInt(2); // 1 or 2 jobs per company
            for (int i = 0; i < numJobs; i++) {
                String role = roles.get(random.nextInt(roles.size()));
                double minCgpa = 6.0 + (random.nextDouble() * 2.5);
                double salary = 800000 + (random.nextInt(15) * 100000);
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
        j.setLocation(LOCATIONS.get(random.nextInt(LOCATIONS.size())));
        j.setRequirements(String.join(", ", ROLE_SKILLS.getOrDefault(role, List.of("Teamwork", "Communication"))));
        j.setMaxBacklogs(random.nextInt(2));

        int numDeps = 1 + random.nextInt(2);
        List<String> deps = new ArrayList<>(DEPARTMENTS);
        Collections.shuffle(deps);
        j.setAllowedDepartments(String.join(", ", deps.subList(0, numDeps)));

        j.setPostedAt(LocalDateTime.now().minusDays(random.nextInt(20) + 1));
        return j;
    }

    // ================= STUDENTS =================
    private List<StudentProfile> seedStudents() {
        List<StudentProfile> students = new ArrayList<>();

        // 1. Seed Diverse Profiles
        students.add(createStudent("Dharanish", "dharanish@mail.com", 9.5, 0, "Computer Science", 2026,
                "Java, Spring Boot, React, Next.js, PostgreSQL"));
        students.add(createStudent("Alice Johnson", "alice@mail.com", 8.8, 0, "IT", 2026,
                "React, TypeScript, Node.js, Tailwind CSS"));
        students.add(createStudent("Bob Smith", "bob@mail.com", 6.5, 2, "Electronics", 2026,
                "Python, C++, Embedded Systems"));
        students.add(createStudent("Charlie Davis", "charlie@mail.com", 7.8, 0, "AI & Data Science", 2026,
                "Python, PyTorch, SQL, Pandas"));
        students.add(createStudent("Eve Wilson", "eve@mail.com", 9.2, 0, "Cyber Security", 2026,
                "Linux, Nmap, Metasploit, Security Auditing"));
        students.add(createStudent("Frank Miller", "frank@mail.com", 7.0, 0, "Blockchain Technology", 2026,
                "Solidity, Web3.js, Ethereum, Rust"));

        // 2. Seed Remaining Students
        for (int i = 1; i <= STUDENT_COUNT - 6; i++) {
            double cgpa = 6.0 + (random.nextDouble() * 3.5);
            int backlogs = random.nextInt(4) == 0 ? random.nextInt(2) : 0;
            String dept = DEPARTMENTS.get(random.nextInt(DEPARTMENTS.size()));
            int gradYear = 2025 + random.nextInt(2);

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
        ApplicationStatus[] statuses = ApplicationStatus.values();
        int statusIdx = 0;

        for (StudentProfile s : students) {
            List<JobProfile> eligibleJobs = jobs.stream()
                    .filter(j -> s.getCgpa() >= j.getMinCgpa() && s.getBacklogs() <= j.getMaxBacklogs())
                    .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);

            if (eligibleJobs.isEmpty())
                continue;
            Collections.shuffle(eligibleJobs);

            int appsToCreate = 2 + random.nextInt(2);
            for (int i = 0; i < Math.min(appsToCreate, eligibleJobs.size()); i++) {
                JobProfile j = eligibleJobs.get(i);
                Application app = new Application();
                app.setStudentProfile(s);
                app.setJobProfile(j);
                app.setAppliedAt(j.getPostedAt().plusDays(random.nextInt(3) + 1));

                // Cycle through statuses to ensure "render all" in UI
                app.setStatus(statuses[statusIdx % statuses.length]);
                statusIdx++;

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
            "Need to improve on specific domain knowledge.",
            "Very enthusiastic and fits well with our company culture.",
            "Solid experience with the required tech stack.",
            "Problem-solving approach was logical and efficient.",
            "Great team player attitude.",
            "Could sharpen coding speed, but code quality is high.",
            "Clear and concise answers.");

    private void createInterviewFlow(Application app) {
        int rounds = switch (app.getStatus()) {
            case OFFER, SELECTED -> 3;
            case INTERVIEW -> 2;
            case SHORTLISTED, REJECTED -> 1;
            default -> 0;
        };

        for (int i = 1; i <= rounds; i++) {
            InterviewStatus status = InterviewStatus.COMPLETED;
            int daysOffset = -5 + i;

            if (i == rounds) {
                if (app.getStatus() == ApplicationStatus.INTERVIEW) {
                    status = InterviewStatus.SCHEDULED;
                    daysOffset = random.nextInt(5) + 1;
                } else if (app.getStatus() == ApplicationStatus.SHORTLISTED) {
                    status = InterviewStatus.COMPLETED;
                    daysOffset = -1;
                }
            }

            String mode = (i % 2 == 0) ? "offline" : "online";
            InterviewRound round = round(app, i, mode, daysOffset);
            round.setStatus(status);

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