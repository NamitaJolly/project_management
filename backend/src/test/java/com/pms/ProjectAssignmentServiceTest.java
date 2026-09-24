package com.pms;

import com.pms.dto.AssignmentRequest;
import com.pms.dto.EmployeeSkillMatchDto;
import com.pms.model.Employee;
import com.pms.model.Project;
import com.pms.model.ProjectAssignment;
import com.pms.model.ProjectStatus;
import com.pms.repository.EmployeeRepository;
import com.pms.repository.ProjectAssignmentRepository;
import com.pms.repository.ProjectRepository;
import com.pms.service.EmployeeService;
import com.pms.service.ProjectAssignmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ProjectAssignmentServiceTest {

    @Autowired
    private ProjectAssignmentService assignmentService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectAssignmentRepository assignmentRepository;

    private Employee employee;
    private Project project;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setName("Test Dev");
        employee.setEmail("test.dev@company.com");
        employee.setDesignation("Full Stack Engineer");
        employee.setSkills(Arrays.asList("Java", "Spring Boot", "Angular"));
        employee.setExperienceYears(4);
        employee.setTotalCapacityPercent(100);
        employee.setAvailableCapacityPercent(100);
        employee = employeeRepository.save(employee);

        project = new Project();
        project.setProjectName("Test PMS Project");
        project.setClient("Acme Corp");
        project.setDescription("Testing core assignment flow");
        project.setStartDate(LocalDate.now());
        project.setStatus(ProjectStatus.PLANNING);
        project.setRequiredSkills(Arrays.asList("Java", "Spring Boot"));
        project = projectRepository.save(project);
    }

    @Test
    void testSuccessfulAssignmentReducesCapacity() {
        AssignmentRequest request = new AssignmentRequest(
                project.getId(),
                employee.getId(),
                "Backend Engineer",
                60,
                LocalDate.now(),
                LocalDate.now().plusMonths(6)
        );

        ProjectAssignment assignment = assignmentService.assignEmployeeToProject(request);

        assertNotNull(assignment.getId());
        assertEquals(60, assignment.getAllocationPercent());

        Employee updatedEmployee = employeeRepository.findById(employee.getId()).orElseThrow();
        assertEquals(40, updatedEmployee.getAvailableCapacityPercent());
    }

    @Test
    void testAssignmentFailsWhenCapacityInsufficient() {
        AssignmentRequest request = new AssignmentRequest(
                project.getId(),
                employee.getId(),
                "Backend Engineer",
                110, // Exceeds 100%
                LocalDate.now(),
                LocalDate.now().plusMonths(6)
        );

        assertThrows(IllegalStateException.class, () -> {
            assignmentService.assignEmployeeToProject(request);
        });
    }

    @Test
    void testDeleteAssignmentRestoresCapacity() {
        AssignmentRequest request = new AssignmentRequest(
                project.getId(),
                employee.getId(),
                "Backend Engineer",
                50,
                LocalDate.now(),
                LocalDate.now().plusMonths(3)
        );

        ProjectAssignment assignment = assignmentService.assignEmployeeToProject(request);
        assertEquals(50, employeeRepository.findById(employee.getId()).orElseThrow().getAvailableCapacityPercent());

        assignmentService.removeAssignment(assignment.getId());

        Employee restoredEmployee = employeeRepository.findById(employee.getId()).orElseThrow();
        assertEquals(100, restoredEmployee.getAvailableCapacityPercent());
    }

    @Test
    void testSearchEmployeesSkillRanking() {
        List<EmployeeSkillMatchDto> results = employeeService.searchEmployees(
                Arrays.asList("Java", "Spring Boot"),
                3,
                50
        );

        assertFalse(results.isEmpty());
        // Verify test dev has 100% match on Java & Spring Boot
        EmployeeSkillMatchDto first = results.stream()
                .filter(dto -> dto.getEmployee().getId().equals(employee.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(first);
        assertEquals(100.0, first.getMatchPercentage());
        assertEquals(2, first.getMatchCount());
    }

	public ProjectAssignmentRepository getAssignmentRepository() {
		return assignmentRepository;
	}

	public void setAssignmentRepository(ProjectAssignmentRepository assignmentRepository) {
		this.assignmentRepository = assignmentRepository;
	}
}
