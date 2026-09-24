-- ==============================================================================
-- PulsePMI: Realistic Seed Data for In-Memory Database
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Seed Employees (15 Diverse Engineers across Full-Stack, Cloud, DevOps, Security)
-- ------------------------------------------------------------------------------
INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (1, 'Alex Chen', 'alex.chen@company.com', 'Lead Full-Stack Architect', 8, 100, 50);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (2, 'Sarah Connor', 'sarah.connor@company.com', 'Senior Frontend Engineer', 6, 100, 25);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (3, 'Michael Ross', 'michael.ross@company.com', 'Backend Systems Specialist', 7, 100, 100);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (4, 'Emily Blunt', 'emily.blunt@company.com', 'Cloud DevOps & SRE Engineer', 5, 100, 75);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (5, 'David Kim', 'david.kim@company.com', 'UI/UX & Angular Developer', 4, 100, 100);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (6, 'Jessica Pearson', 'jessica.pearson@company.com', 'Java Backend Developer', 3, 100, 50);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (7, 'Robert Zane', 'robert.zane@company.com', 'QA Automation Architect', 5, 100, 100);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (8, 'Donna Paulsen', 'donna.paulsen@company.com', 'Fullstack Agile Engineer', 6, 100, 100);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (9, 'Marcus Vance', 'marcus.vance@company.com', 'Principal Cloud Security Architect', 10, 100, 60);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (10, 'Priya Sharma', 'priya.sharma@company.com', 'Senior Angular UI/UX Specialist', 5, 100, 50);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (11, 'Liam O''Connor', 'liam.oconnor@company.com', 'Staff AI & Data Platform Engineer', 7, 100, 100);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (12, 'Amina Al-Mansoor', 'amina.mansoor@company.com', 'Lead Backend & Microservices Engineer', 6, 100, 25);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (13, 'Lucas Silva', 'lucas.silva@company.com', 'Mobile & Fullstack Developer', 4, 100, 50);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (14, 'Chloe Dupont', 'chloe.dupont@company.com', 'DevOps & Infrastructure Automation Lead', 6, 100, 100);

INSERT INTO employees (id, name, email, designation, experience_years, total_capacity_percent, available_capacity_percent)
VALUES (15, 'Siddharth Nair', 'siddharth.nair@company.com', 'QA Automation & Performance Engineer', 4, 100, 100);

-- ------------------------------------------------------------------------------
-- Seed Employee Skills
-- ------------------------------------------------------------------------------
-- 1. Alex Chen
INSERT INTO employee_skills (employee_id, skill) VALUES (1, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (1, 'Spring Boot');
INSERT INTO employee_skills (employee_id, skill) VALUES (1, 'Angular');
INSERT INTO employee_skills (employee_id, skill) VALUES (1, 'TypeScript');
INSERT INTO employee_skills (employee_id, skill) VALUES (1, 'Docker');
INSERT INTO employee_skills (employee_id, skill) VALUES (1, 'Kubernetes');
INSERT INTO employee_skills (employee_id, skill) VALUES (1, 'AWS');

-- 2. Sarah Connor
INSERT INTO employee_skills (employee_id, skill) VALUES (2, 'Angular');
INSERT INTO employee_skills (employee_id, skill) VALUES (2, 'TypeScript');
INSERT INTO employee_skills (employee_id, skill) VALUES (2, 'RxJS');
INSERT INTO employee_skills (employee_id, skill) VALUES (2, 'HTML5');
INSERT INTO employee_skills (employee_id, skill) VALUES (2, 'CSS3');

-- 3. Michael Ross
INSERT INTO employee_skills (employee_id, skill) VALUES (3, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (3, 'Spring Boot');
INSERT INTO employee_skills (employee_id, skill) VALUES (3, 'Microservices');
INSERT INTO employee_skills (employee_id, skill) VALUES (3, 'Kafka');
INSERT INTO employee_skills (employee_id, skill) VALUES (3, 'SQL');
INSERT INTO employee_skills (employee_id, skill) VALUES (3, 'Redis');

-- 4. Emily Blunt
INSERT INTO employee_skills (employee_id, skill) VALUES (4, 'Docker');
INSERT INTO employee_skills (employee_id, skill) VALUES (4, 'Kubernetes');
INSERT INTO employee_skills (employee_id, skill) VALUES (4, 'AWS');
INSERT INTO employee_skills (employee_id, skill) VALUES (4, 'CI/CD');
INSERT INTO employee_skills (employee_id, skill) VALUES (4, 'Linux');

-- 5. David Kim
INSERT INTO employee_skills (employee_id, skill) VALUES (5, 'Angular');
INSERT INTO employee_skills (employee_id, skill) VALUES (5, 'TypeScript');
INSERT INTO employee_skills (employee_id, skill) VALUES (5, 'UI/UX');
INSERT INTO employee_skills (employee_id, skill) VALUES (5, 'CSS3');
INSERT INTO employee_skills (employee_id, skill) VALUES (5, 'HTML5');

-- 6. Jessica Pearson
INSERT INTO employee_skills (employee_id, skill) VALUES (6, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (6, 'Spring Boot');
INSERT INTO employee_skills (employee_id, skill) VALUES (6, 'SQL');
INSERT INTO employee_skills (employee_id, skill) VALUES (6, 'Hibernate');

-- 7. Robert Zane
INSERT INTO employee_skills (employee_id, skill) VALUES (7, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (7, 'Selenium');
INSERT INTO employee_skills (employee_id, skill) VALUES (7, 'CI/CD');
INSERT INTO employee_skills (employee_id, skill) VALUES (7, 'Postman');

-- 8. Donna Paulsen
INSERT INTO employee_skills (employee_id, skill) VALUES (8, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (8, 'Angular');
INSERT INTO employee_skills (employee_id, skill) VALUES (8, 'TypeScript');
INSERT INTO employee_skills (employee_id, skill) VALUES (8, 'Agile');

-- 9. Marcus Vance
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'Spring Boot');
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'AWS');
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'Kubernetes');
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'Docker');
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'CyberSecurity');
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'OAuth2');
INSERT INTO employee_skills (employee_id, skill) VALUES (9, 'Linux');

-- 10. Priya Sharma
INSERT INTO employee_skills (employee_id, skill) VALUES (10, 'Angular');
INSERT INTO employee_skills (employee_id, skill) VALUES (10, 'TypeScript');
INSERT INTO employee_skills (employee_id, skill) VALUES (10, 'RxJS');
INSERT INTO employee_skills (employee_id, skill) VALUES (10, 'NgRx');
INSERT INTO employee_skills (employee_id, skill) VALUES (10, 'TailwindCSS');
INSERT INTO employee_skills (employee_id, skill) VALUES (10, 'HTML5');
INSERT INTO employee_skills (employee_id, skill) VALUES (10, 'CSS3');

-- 11. Liam O'Connor
INSERT INTO employee_skills (employee_id, skill) VALUES (11, 'Python');
INSERT INTO employee_skills (employee_id, skill) VALUES (11, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (11, 'Spring Boot');
INSERT INTO employee_skills (employee_id, skill) VALUES (11, 'Kafka');
INSERT INTO employee_skills (employee_id, skill) VALUES (11, 'SQL');
INSERT INTO employee_skills (employee_id, skill) VALUES (11, 'Docker');

-- 12. Amina Al-Mansoor
INSERT INTO employee_skills (employee_id, skill) VALUES (12, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (12, 'Spring Boot');
INSERT INTO employee_skills (employee_id, skill) VALUES (12, 'Microservices');
INSERT INTO employee_skills (employee_id, skill) VALUES (12, 'PostgreSQL');
INSERT INTO employee_skills (employee_id, skill) VALUES (12, 'Docker');
INSERT INTO employee_skills (employee_id, skill) VALUES (12, 'Redis');
INSERT INTO employee_skills (employee_id, skill) VALUES (12, 'Kubernetes');

-- 13. Lucas Silva
INSERT INTO employee_skills (employee_id, skill) VALUES (13, 'Angular');
INSERT INTO employee_skills (employee_id, skill) VALUES (13, 'TypeScript');
INSERT INTO employee_skills (employee_id, skill) VALUES (13, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (13, 'Spring Boot');
INSERT INTO employee_skills (employee_id, skill) VALUES (13, 'REST APIs');
INSERT INTO employee_skills (employee_id, skill) VALUES (13, 'SQL');

-- 14. Chloe Dupont
INSERT INTO employee_skills (employee_id, skill) VALUES (14, 'Terraform');
INSERT INTO employee_skills (employee_id, skill) VALUES (14, 'AWS');
INSERT INTO employee_skills (employee_id, skill) VALUES (14, 'Docker');
INSERT INTO employee_skills (employee_id, skill) VALUES (14, 'Kubernetes');
INSERT INTO employee_skills (employee_id, skill) VALUES (14, 'CI/CD');
INSERT INTO employee_skills (employee_id, skill) VALUES (14, 'Linux');

-- 15. Siddharth Nair
INSERT INTO employee_skills (employee_id, skill) VALUES (15, 'Cypress');
INSERT INTO employee_skills (employee_id, skill) VALUES (15, 'Selenium');
INSERT INTO employee_skills (employee_id, skill) VALUES (15, 'Java');
INSERT INTO employee_skills (employee_id, skill) VALUES (15, 'CI/CD');
INSERT INTO employee_skills (employee_id, skill) VALUES (15, 'Postman');
INSERT INTO employee_skills (employee_id, skill) VALUES (15, 'TypeScript');

-- ------------------------------------------------------------------------------
-- Seed Projects (8 High-Impact Industry Projects)
-- ------------------------------------------------------------------------------
INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (1, 'NextGen Cloud Migration', 'Acro Global', 'Enterprise-wide migration of on-premise monolithic architecture to microservices on AWS cloud.', '2026-01-15', '2026-10-30', 'IN_PROGRESS');

INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (2, 'Healthcare Analytics Dashboard', 'MedPulse Health', 'Real-time telemetry and clinical data visualization platform for hospital networks.', '2026-03-01', '2026-12-15', 'IN_PROGRESS');

INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (3, 'Fintech Mobile & Web Banking Core', 'Horizon Capital', 'Next generation high-throughput retail banking engine and secure web client.', '2026-05-01', '2027-02-28', 'PLANNING');

INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (4, 'Enterprise Security Audit & Compliance', 'SecureFirst Systems', 'Security hardening, zero-trust infrastructure audit and compliance automation.', '2025-06-01', '2025-12-31', 'COMPLETED');

INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (5, 'Autonomous Supply Chain & Logistics Engine', 'OmniLogix Freight', 'Event-driven supply chain tracking platform with predictive ETA telemetry and automated freight dispatching.', '2026-02-01', '2026-11-30', 'IN_PROGRESS');

INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (6, 'Next-Gen Omni-Channel Retail Portal', 'Aura Luxury Brands', 'High-conversion customer experience storefront featuring sub-second catalog search and interactive product customizer.', '2026-04-15', '2027-01-31', 'PLANNING');

INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (7, 'Zero-Trust Cloud Identity & Threat Prevention', 'CyberFortress Defense', 'Centralized identity provider and adaptive threat prevention system implementing OAuth2/OIDC and microsegmentation.', '2026-01-10', '2026-08-30', 'IN_PROGRESS');

INSERT INTO projects (id, project_name, client, description, start_date, end_date, status)
VALUES (8, 'IoT Smart Energy & Grid Analytics', 'EcoGrid Utilities', 'Scalable time-series ingestion engine analyzing sensor data from 50,000+ power grid distribution nodes.', '2026-06-01', '2027-04-30', 'PLANNING');

-- ------------------------------------------------------------------------------
-- Seed Project Required Skills
-- ------------------------------------------------------------------------------
-- Project 1 (Cloud Migration)
INSERT INTO project_required_skills (project_id, skill) VALUES (1, 'Java');
INSERT INTO project_required_skills (project_id, skill) VALUES (1, 'Spring Boot');
INSERT INTO project_required_skills (project_id, skill) VALUES (1, 'Docker');
INSERT INTO project_required_skills (project_id, skill) VALUES (1, 'Kubernetes');
INSERT INTO project_required_skills (project_id, skill) VALUES (1, 'AWS');

-- Project 2 (Healthcare Analytics)
INSERT INTO project_required_skills (project_id, skill) VALUES (2, 'Angular');
INSERT INTO project_required_skills (project_id, skill) VALUES (2, 'TypeScript');
INSERT INTO project_required_skills (project_id, skill) VALUES (2, 'Java');
INSERT INTO project_required_skills (project_id, skill) VALUES (2, 'Spring Boot');
INSERT INTO project_required_skills (project_id, skill) VALUES (2, 'SQL');

-- Project 3 (Fintech Banking)
INSERT INTO project_required_skills (project_id, skill) VALUES (3, 'Angular');
INSERT INTO project_required_skills (project_id, skill) VALUES (3, 'TypeScript');
INSERT INTO project_required_skills (project_id, skill) VALUES (3, 'RxJS');
INSERT INTO project_required_skills (project_id, skill) VALUES (3, 'Microservices');
INSERT INTO project_required_skills (project_id, skill) VALUES (3, 'Kafka');
INSERT INTO project_required_skills (project_id, skill) VALUES (3, 'Redis');

-- Project 4 (Enterprise Security)
INSERT INTO project_required_skills (project_id, skill) VALUES (4, 'Java');
INSERT INTO project_required_skills (project_id, skill) VALUES (4, 'Linux');
INSERT INTO project_required_skills (project_id, skill) VALUES (4, 'Docker');
INSERT INTO project_required_skills (project_id, skill) VALUES (4, 'CI/CD');

-- Project 5 (Supply Chain & Logistics)
INSERT INTO project_required_skills (project_id, skill) VALUES (5, 'Java');
INSERT INTO project_required_skills (project_id, skill) VALUES (5, 'Spring Boot');
INSERT INTO project_required_skills (project_id, skill) VALUES (5, 'Microservices');
INSERT INTO project_required_skills (project_id, skill) VALUES (5, 'PostgreSQL');
INSERT INTO project_required_skills (project_id, skill) VALUES (5, 'Kafka');
INSERT INTO project_required_skills (project_id, skill) VALUES (5, 'Redis');

-- Project 6 (Omni-Channel Retail)
INSERT INTO project_required_skills (project_id, skill) VALUES (6, 'Angular');
INSERT INTO project_required_skills (project_id, skill) VALUES (6, 'TypeScript');
INSERT INTO project_required_skills (project_id, skill) VALUES (6, 'RxJS');
INSERT INTO project_required_skills (project_id, skill) VALUES (6, 'NgRx');
INSERT INTO project_required_skills (project_id, skill) VALUES (6, 'TailwindCSS');
INSERT INTO project_required_skills (project_id, skill) VALUES (6, 'REST APIs');

-- Project 7 (Zero-Trust Identity & Security)
INSERT INTO project_required_skills (project_id, skill) VALUES (7, 'Java');
INSERT INTO project_required_skills (project_id, skill) VALUES (7, 'Spring Boot');
INSERT INTO project_required_skills (project_id, skill) VALUES (7, 'AWS');
INSERT INTO project_required_skills (project_id, skill) VALUES (7, 'Kubernetes');
INSERT INTO project_required_skills (project_id, skill) VALUES (7, 'CyberSecurity');
INSERT INTO project_required_skills (project_id, skill) VALUES (7, 'OAuth2');

-- Project 8 (IoT Smart Energy)
INSERT INTO project_required_skills (project_id, skill) VALUES (8, 'Java');
INSERT INTO project_required_skills (project_id, skill) VALUES (8, 'Spring Boot');
INSERT INTO project_required_skills (project_id, skill) VALUES (8, 'Kafka');
INSERT INTO project_required_skills (project_id, skill) VALUES (8, 'SQL');
INSERT INTO project_required_skills (project_id, skill) VALUES (8, 'Docker');
INSERT INTO project_required_skills (project_id, skill) VALUES (8, 'Python');

-- ------------------------------------------------------------------------------
-- Seed Project Assignments (Realistic Multi-Team Allocations)
-- ------------------------------------------------------------------------------
-- Project 1 (Cloud Migration)
INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (1, 1, 1, 'Lead Solution Architect', 50, '2026-01-15', '2026-10-30');

INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (2, 1, 4, 'DevOps Lead', 25, '2026-02-01', '2026-10-30');

-- Project 2 (Healthcare Analytics)
INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (3, 2, 6, 'Backend Engineer', 50, '2026-03-01', '2026-12-15');

-- Project 3 (Fintech Banking)
INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (4, 3, 2, 'Lead Frontend Engineer', 75, '2026-05-01', '2027-02-28');

-- Project 5 (Supply Chain)
INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (5, 5, 12, 'Lead Microservices Engineer', 75, '2026-02-01', '2026-11-30');

INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (6, 5, 13, 'Fullstack Integration Dev', 50, '2026-02-15', '2026-11-30');

-- Project 6 (Omni-Channel Retail)
INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (7, 6, 10, 'Lead Angular UI Architect', 50, '2026-04-15', '2027-01-31');

-- Project 7 (Zero-Trust Security)
INSERT INTO project_assignments (id, project_id, employee_id, assigned_role, allocation_percent, start_date, end_date)
VALUES (8, 7, 9, 'Principal Security Architect', 40, '2026-01-10', '2026-08-30');

-- ------------------------------------------------------------------------------
-- Auto-Increment Sequence Synchronization
-- ------------------------------------------------------------------------------
ALTER TABLE employees ALTER COLUMN id RESTART WITH 16;
ALTER TABLE projects ALTER COLUMN id RESTART WITH 9;
ALTER TABLE project_assignments ALTER COLUMN id RESTART WITH 9;
