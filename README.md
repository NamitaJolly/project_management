# PulsePMI - Project Allocator

A modern, production-grade Project Management System built with **Java Spring Boot** (Java 17/21) on the backend and **Angular 17** on the frontend.

---

## 🚀 Key Features

- **Core Entities & Domain**:
  - **Employee**: ID, name, email, designation, skills list, experience years, total capacity % (100%), available capacity %.
  - **Project**: ID, project name, client, description, timeline (start/end), status (`PLANNING`, `IN_PROGRESS`, `COMPLETED`), required skills list.
  - **ProjectAssignment**: ID, project reference, employee reference, assigned role, allocation % (e.g., 50%, 100%), tenure dates.
- **Smart Skill Matching & Ranking**:
  - Automatically scores and ranks matching employees based on project required skills, minimum experience, and available capacity.
- **Automated Capacity Management**:
  - Assigning an employee automatically verifies available capacity and reduces their `availableCapacityPercent`.
  - Releasing / deleting an assignment automatically restores the employee's capacity back to their pool.
- **Operational Dashboard**:
  - Real-time overview of active projects, talent bench, total employees, and dynamic resource utilization rate gauge.
- **Project Workspace View**:
  - Comprehensive view of project scope, required skills, and assigned team roster with release actions.
- **Resource Mapping Modal**:
  - Dynamic skill toggle, experience and capacity sliders, ranked candidate cards showing matched vs missing skills, and instant allocation with preset buttons (25%, 50%, 75%, 100%).
- **Pre-configured In-Memory H2 Database**:
  - Realistic seed data pre-populated via `data.sql` with 15 diverse engineers (Security Architects, Full-Stack, Frontend, Backend, AI/Data, Cloud/DevOps, Mobile, QA) across 8 real-world enterprise projects and multi-team assignments.

---

## 📁 Repository Structure

```
project-management-system/
├── backend/                              # Spring Boot 3 Application
│   ├── pom.xml
│   ├── .mvn/wrapper/
│   └── src/
│       ├── main/
│       │   ├── java/com/pms/
│       │   │   ├── ProjectManagementApplication.java
│       │   │   ├── config/WebCorsConfig.java
│       │   │   ├── model/ (Employee, Project, ProjectStatus, ProjectAssignment)
│       │   │   ├── dto/ (AssignmentRequest, EmployeeSkillMatchDto, DashboardSummaryDto)
│       │   │   ├── repository/ (EmployeeRepository, ProjectRepository, ProjectAssignmentRepository)
│       │   │   ├── service/ (EmployeeService, ProjectService, ProjectAssignmentService, DashboardService)
│       │   │   ├── controller/ (EmployeeController, ProjectController, ProjectAssignmentController, DashboardController)
│       │   │   └── exception/ (GlobalExceptionHandler)
│       │   └── resources/
│       │       ├── application.properties
│       │       └── data.sql              # Realistic seed data
│       └── test/...                      # Unit & integration tests
└── frontend/                             # Angular 17 Application
    ├── package.json
    ├── angular.json
    ├── tsconfig.json
    └── src/
        ├── index.html
        ├── styles.css                    # Modern Design System (dark-mode theme)
        ├── main.ts
        └── app/
            ├── models/ (employee, project, assignment, dashboard)
            ├── services/ (employee, project, assignment, dashboard)
            ├── components/
            │   ├── navbar/
            │   ├── dashboard/
            │   ├── project-workspace/
            │   ├── resource-mapping-modal/
            │   └── employee-directory/
            └── app.routes.ts
```

---

## 🛠️ How to Run

### Prerequisites
- **Java 17 or 21 JDK** (e.g. Eclipse Temurin, Amazon Corretto, or Microsoft OpenJDK)
- **Node.js** (v18+) and **npm**

---

### 1. Starting the Spring Boot Backend

From the `backend` directory:

```bash
cd backend
mvn spring-boot:run
```
*(Or open the `backend` directory in IntelliJ IDEA, Eclipse, or VS Code and run `ProjectManagementApplication.java`)*

- The backend will start on **`http://localhost:8080`**.
- **H2 Console**: Accessible at **`http://localhost:8080/h2-console`**
  - JDBC URL: `jdbc:h2:mem:projectmgmt`
  - Username: `sa`
  - Password: *(leave blank)*

---

### 2. Starting the Angular Frontend

From the `frontend` directory:

```bash
cd frontend
npm install
npm start
```

- The frontend application will start on **`http://localhost:4200`**.
- Open `http://localhost:4200` in your browser.

---

## 🔌 API Reference

### Employees
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | List all employees with skills & capacity |
| `GET` | `/api/employees/{id}` | Get employee by ID |
| `POST` | `/api/employees` | Create new employee |
| `PUT` | `/api/employees/{id}` | Update employee |
| `DELETE`| `/api/employees/{id}` | Delete employee and release assignments |
| `GET` | `/api/employees/search?skills=Java,Docker&minExperience=3&minCapacity=50` | Search & rank employees by skill match & capacity |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects (supports `?status=IN_PROGRESS`) |
| `GET` | `/api/projects/{id}` | Get project details |
| `POST` | `/api/projects` | Create new project with required skills |
| `PUT` | `/api/projects/{id}` | Update project |
| `DELETE`| `/api/projects/{id}` | Delete project and restore member capacities |

### Project Assignments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments?projectId={id}` | Get assigned team roster for project |
| `POST` | `/api/assignments` | Assign employee (auto-reduces available capacity) |
| `DELETE`| `/api/assignments/{id}` | Release assignment (auto-restores employee capacity) |

#### Example Assignment Request Payload:
```json
{
  "projectId": 1,
  "employeeId": 3,
  "assignedRole": "Senior Backend Architect",
  "allocationPercent": 50,
  "startDate": "2026-04-01",
  "endDate": "2026-10-30"
}
```

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Active projects, total employees, utilization rate % |
