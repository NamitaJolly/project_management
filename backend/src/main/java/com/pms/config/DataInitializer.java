package com.pms.config;

import com.pms.auth.User;
import com.pms.auth.UserRepository;
import com.pms.model.Employee;
import com.pms.model.Project;
import com.pms.model.ProjectAssignment;
import com.pms.model.ProjectStatus;
import com.pms.repository.EmployeeRepository;
import com.pms.repository.ProjectAssignmentRepository;
import com.pms.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository assignmentRepository;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           EmployeeRepository employeeRepository,
                           ProjectRepository projectRepository,
                           ProjectAssignmentRepository assignmentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        System.out.println(">>> [TeamFlow DataInitializer] Default RMG user accounts verified.");

        List<Employee> employees;
        if (employeeRepository.count() == 0) {
            employees = seedEmployees();
            System.out.println(">>> [TeamFlow DataInitializer] Successfully seeded " + employees.size() + " default employees.");
        } else {
            employees = employeeRepository.findAll();
        }

        List<Project> projects;
        if (projectRepository.count() == 0) {
            projects = seedProjects();
            System.out.println(">>> [TeamFlow DataInitializer] Successfully seeded " + projects.size() + " default projects.");
        } else {
            projects = projectRepository.findAll();
        }

        if (assignmentRepository.count() == 0 && employees.size() >= 20 && projects.size() >= 12) {
            seedAssignments(employees, projects);
            System.out.println(">>> [TeamFlow DataInitializer] Successfully seeded default project resource assignments.");
        }
    }

    // ── Default RMG Accounts ─────────────────────────────────────────────────

    private void seedUsers() {
        createUser("admin",     "admin@company.com",      "Admin@123",  "ROLE_RMG");
        createUser("sarah_rmg", "sarah.rmg@company.com",  "Sarah@2026", "ROLE_RMG");
        createUser("alex_rmg",  "alex.rmg@company.com",   "Alex#2026",  "ROLE_RMG");
        createUser("priya_rmg", "priya.rmg@company.com",  "Priya!2026", "ROLE_RMG");
    }

    private void createUser(String username, String email, String rawPassword, String role) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            userRepository.save(user);
        }
    }

    // ── 20 Default Employees ─────────────────────────────────────────────────

    private List<Employee> seedEmployees() {
        List<Employee> employees = Arrays.asList(
            emp("Alex Chen",         "alex.chen@company.com",      "Lead Full-Stack Architect",                     8,  100, 50,  "Java","Spring Boot","Angular","TypeScript","Docker","Kubernetes","AWS"),
            emp("Sarah Connor",      "sarah.connor@company.com",   "Senior Frontend Engineer",                      6,  100, 25,  "Angular","TypeScript","RxJS","HTML5","CSS3"),
            emp("Michael Ross",      "michael.ross@company.com",   "Backend Systems Specialist",                    7,  100, 100, "Java","Spring Boot","Microservices","Kafka","SQL","Redis"),
            emp("Emily Blunt",       "emily.blunt@company.com",    "Cloud DevOps & SRE Engineer",                  5,  100, 75,  "Docker","Kubernetes","AWS","CI/CD","Linux"),
            emp("David Kim",         "david.kim@company.com",      "UI/UX & Angular Developer",                     4,  100, 100, "Angular","TypeScript","UI/UX","CSS3","HTML5"),
            emp("Jessica Pearson",   "jessica.pearson@company.com","Java Backend Developer",                        3,  100, 50,  "Java","Spring Boot","SQL","Hibernate"),
            emp("Robert Zane",       "robert.zane@company.com",    "QA Automation Architect",                       5,  100, 100, "Java","Selenium","CI/CD","Postman"),
            emp("Donna Paulsen",     "donna.paulsen@company.com",  "Fullstack Agile Engineer",                      6,  100, 100, "Java","Angular","TypeScript","Agile"),
            emp("Marcus Vance",      "marcus.vance@company.com",   "Principal Cloud Security Architect",            10, 100, 60,  "Java","Spring Boot","AWS","Kubernetes","Docker","CyberSecurity","OAuth2","Linux"),
            emp("Priya Sharma",      "priya.sharma@company.com",   "Senior Angular UI/UX Specialist",               5,  100, 50,  "Angular","TypeScript","RxJS","NgRx","TailwindCSS","HTML5","CSS3"),
            emp("Liam OConnor",      "liam.oconnor@company.com",   "Staff AI & Data Platform Engineer",             7,  100, 100, "Python","Java","Spring Boot","Kafka","SQL","Docker"),
            emp("Amina Al-Mansoor",  "amina.mansoor@company.com",  "Lead Backend & Microservices Engineer",         6,  100, 25,  "Java","Spring Boot","Microservices","PostgreSQL","Docker","Redis","Kubernetes"),
            emp("Lucas Silva",       "lucas.silva@company.com",    "Mobile & Fullstack Developer",                  4,  100, 50,  "Angular","TypeScript","Java","Spring Boot","REST APIs","SQL"),
            emp("Chloe Dupont",      "chloe.dupont@company.com",   "DevOps & Infrastructure Automation Lead",       6,  100, 100, "Terraform","AWS","Docker","Kubernetes","CI/CD","Linux"),
            emp("Siddharth Nair",    "siddharth.nair@company.com", "QA Automation & Performance Engineer",          4,  100, 100, "Cypress","Selenium","Java","CI/CD","Postman","TypeScript"),
            emp("Aarav Patel",       "aarav.patel@company.com",    "Senior AI & ML Architect",                      8,  100, 75,  "Python","AI","Docker","AWS","Kafka"),
            emp("Elena Rostova",     "elena.rostova@company.com",  "Full-Stack React & Node Lead",                  6,  100, 50,  "React","TypeScript","REST APIs","SQL"),
            emp("Kofi Mensah",       "kofi.mensah@company.com",    "DevSecOps & Platform Engineer",                 5,  100, 100, "Kubernetes","AWS","CyberSecurity","CI/CD","Linux"),
            emp("Mei Ling",          "mei.ling@company.com",       "Angular UI/UX Design System Specialist",        4,  100, 60,  "Angular","TypeScript","UI/UX","CSS3","HTML5"),
            emp("Gabriel Santos",    "gabriel.santos@company.com", "High-Throughput Distributed Systems Engineer",  7,  100, 100, "Java","Spring Boot","Microservices","Kafka","Redis","SQL")
        );
        return employeeRepository.saveAll(employees);
    }

    private Employee emp(String name, String email, String designation,
                         int expYears, int totalCap, int availCap, String... skills) {
        Employee e = new Employee();
        e.setName(name);
        e.setEmail(email);
        e.setDesignation(designation);
        e.setExperienceYears(expYears);
        e.setTotalCapacityPercent(totalCap);
        e.setAvailableCapacityPercent(availCap);
        e.setSkills(Arrays.asList(skills));
        return e;
    }

    // ── 12 Default Projects ───────────────────────────────────────────────────

    private List<Project> seedProjects() {
        List<Project> projects = Arrays.asList(
            proj("NextGen Cloud Migration",                   "Acro Global",              "Enterprise-wide migration of on-premise monolithic architecture to microservices on AWS cloud.",
                 "2026-01-15", "2026-10-30", ProjectStatus.IN_PROGRESS,  "Java","Spring Boot","Docker","Kubernetes","AWS"),
            proj("Healthcare Analytics Dashboard",            "MedPulse Health",          "Real-time telemetry and clinical data visualization platform for hospital networks.",
                 "2026-03-01", "2026-12-15", ProjectStatus.IN_PROGRESS,  "Angular","TypeScript","Java","Spring Boot","SQL"),
            proj("Fintech Mobile & Web Banking Core",         "Horizon Capital",          "Next generation high-throughput retail banking engine and secure web client.",
                 "2026-05-01", "2027-02-28", ProjectStatus.IN_PROGRESS,   "Angular","TypeScript","RxJS","Microservices","Kafka","Redis"),
            proj("Enterprise Security Audit & Compliance",   "SecureFirst Systems",      "Security hardening, zero-trust infrastructure audit and compliance automation.",
                 "2025-06-01", "2025-12-31", ProjectStatus.COMPLETED,     "Java","Linux","Docker","CI/CD"),
            proj("Autonomous Supply Chain & Logistics Engine","OmniLogix Freight",       "Event-driven supply chain tracking platform with predictive ETA telemetry.",
                 "2026-02-01", "2026-11-30", ProjectStatus.IN_PROGRESS,  "Java","Spring Boot","Microservices","PostgreSQL","Kafka","Redis"),
            proj("Next-Gen Omni-Channel Retail Portal",       "Aura Luxury Brands",      "High-conversion customer experience storefront with sub-second catalog search.",
                 "2026-04-15", "2027-01-31", ProjectStatus.IN_PROGRESS,   "Angular","TypeScript","RxJS","NgRx","TailwindCSS","REST APIs"),
            proj("Zero-Trust Cloud Identity & Threat Prevention","CyberFortress Defense","Centralized identity provider implementing OAuth2/OIDC and microsegmentation.",
                 "2026-01-10", "2026-08-30", ProjectStatus.IN_PROGRESS,  "Java","Spring Boot","AWS","Kubernetes","CyberSecurity","OAuth2"),
            proj("IoT Smart Energy & Grid Analytics",         "EcoGrid Utilities",       "Scalable time-series ingestion analyzing sensor data from 50,000+ grid nodes.",
                 "2026-06-01", "2027-04-30", ProjectStatus.IN_PROGRESS,   "Java","Spring Boot","Kafka","SQL","Docker","Python"),
            proj("AI-Powered Telehealth Diagnostics Engine",  "Novacare Health Systems", "Edge-deployed real-time conversational AI and diagnostic imaging telemetry.",
                 "2026-02-10", "2026-11-20", ProjectStatus.IN_PROGRESS,  "Python","AI","Docker","AWS","Kafka"),
            proj("Decentralized Supply Chain Fraud Detection","Vanguard Global Logistics","High-throughput ledger verifying custody events across multimodal shipping routes.",
                 "2026-04-01", "2026-12-31", ProjectStatus.IN_PROGRESS,   "Java","Spring Boot","Kafka","CyberSecurity","Microservices"),
            proj("Smart City Urban Mobility & Transit Mesh",  "MetroTransit Authority",  "Real-time geospatial fleet routing, dynamic congestion pricing, and commuter app.",
                 "2026-01-20", "2026-09-15", ProjectStatus.IN_PROGRESS,  "Angular","TypeScript","TailwindCSS","UI/UX","REST APIs"),
            proj("Automated Cloud Infrastructure SRE Platform","Apex Cloud Technologies","Self-healing container orchestrator automating multi-cloud failover and cost optimization.",
                 "2025-08-01", "2026-01-15", ProjectStatus.COMPLETED,     "Kubernetes","AWS","CI/CD","Linux","Terraform")
        );
        return projectRepository.saveAll(projects);
    }

    private Project proj(String name, String client, String description,
                         String start, String end, ProjectStatus status, String... skills) {
        Project p = new Project();
        p.setProjectName(name);
        p.setClient(client);
        p.setDescription(description);
        p.setStartDate(LocalDate.parse(start));
        p.setEndDate(LocalDate.parse(end));
        p.setStatus(status);
        p.setRequiredSkills(Arrays.asList(skills));
        return p;
    }

    // ── Project Assignments ───────────────────────────────────────────────────

    private void seedAssignments(List<Employee> emps, List<Project> projs) {
        // emps index: 0=Alex,1=Sarah,2=Michael,3=Emily,4=David,5=Jessica,
        //             6=Robert,7=Donna,8=Marcus,9=Priya,10=Liam,11=Amina,
        //             12=Lucas,13=Chloe,14=Siddharth,15=Aarav,16=Elena,
        //             17=Kofi,18=Mei,19=Gabriel
        // projs index: 0..11 matching the order above

        List<ProjectAssignment> assignments = Arrays.asList(
            // Project 0: Cloud Migration
            assign(projs.get(0),  emps.get(0),  "Lead Solution Architect",       50, "2026-01-15", "2026-10-30"),
            assign(projs.get(0),  emps.get(3),  "DevOps Lead",                   25, "2026-02-01", "2026-10-30"),
            // Project 1: Healthcare Analytics
            assign(projs.get(1),  emps.get(5),  "Backend Engineer",               50, "2026-03-01", "2026-12-15"),
            // Project 2: Fintech Banking
            assign(projs.get(2),  emps.get(1),  "Lead Frontend Engineer",         75, "2026-05-01", "2027-02-28"),
            // Project 4: Supply Chain
            assign(projs.get(4),  emps.get(11), "Lead Microservices Engineer",    75, "2026-02-01", "2026-11-30"),
            assign(projs.get(4),  emps.get(12), "Fullstack Integration Dev",      50, "2026-02-15", "2026-11-30"),
            // Project 5: Omni-Channel Retail
            assign(projs.get(5),  emps.get(9),  "Lead Angular UI Architect",      50, "2026-04-15", "2027-01-31"),
            // Project 6: Zero-Trust Security
            assign(projs.get(6),  emps.get(8),  "Principal Security Architect",   40, "2026-01-10", "2026-08-30"),
            // Project 8: AI Telehealth
            assign(projs.get(8),  emps.get(15), "Lead AI Research Engineer",      25, "2026-02-10", "2026-11-20"),
            // Project 10: Smart City Transit
            assign(projs.get(10), emps.get(18), "Lead Frontend & UX Architect",   40, "2026-01-20", "2026-09-15")
        );
        assignmentRepository.saveAll(assignments);

        // Update available capacity for assigned employees
        updateCapacity(emps.get(0),  50);  // Alex: 50% used
        updateCapacity(emps.get(1),  25);  // Sarah: 75% used
        updateCapacity(emps.get(3),  75);  // Emily: 25% used
        updateCapacity(emps.get(5),  50);  // Jessica: 50% used
        updateCapacity(emps.get(8),  60);  // Marcus: 40% used
        updateCapacity(emps.get(9),  50);  // Priya: 50% used
        updateCapacity(emps.get(11), 25);  // Amina: 75% used
        updateCapacity(emps.get(12), 50);  // Lucas: 50% used
        updateCapacity(emps.get(15), 75);  // Aarav: 25% used
        updateCapacity(emps.get(18), 60);  // Mei: 40% used
    }

    private ProjectAssignment assign(Project project, Employee employee,
                                     String role, int allocation,
                                     String start, String end) {
        ProjectAssignment a = new ProjectAssignment();
        a.setProject(project);
        a.setEmployee(employee);
        a.setAssignedRole(role);
        a.setAllocationPercent(allocation);
        a.setStartDate(LocalDate.parse(start));
        a.setEndDate(LocalDate.parse(end));
        return a;
    }

    private void updateCapacity(Employee emp, int availablePercent) {
        emp.setAvailableCapacityPercent(availablePercent);
        employeeRepository.save(emp);
    }
}
