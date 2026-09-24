package com.pms.service;

import com.pms.dto.AssignmentRequest;
import com.pms.model.Employee;
import com.pms.model.Project;
import com.pms.model.ProjectAssignment;
import com.pms.repository.EmployeeRepository;
import com.pms.repository.ProjectAssignmentRepository;
import com.pms.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProjectAssignmentService {

    private final ProjectAssignmentRepository assignmentRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectAssignmentService(ProjectAssignmentRepository assignmentRepository,
                                  ProjectRepository projectRepository,
                                  EmployeeRepository employeeRepository) {
        this.assignmentRepository = assignmentRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<ProjectAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public ProjectAssignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Assignment not found with id: " + id));
    }

    public List<ProjectAssignment> getAssignmentsByProjectId(Long projectId) {
        return assignmentRepository.findByProjectId(projectId);
    }

    public List<ProjectAssignment> getAssignmentsByEmployeeId(Long employeeId) {
        return assignmentRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public ProjectAssignment assignEmployeeToProject(AssignmentRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new NoSuchElementException("Project not found with id: " + request.getProjectId()));

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new NoSuchElementException("Employee not found with id: " + request.getEmployeeId()));

        if (employee.getAvailableCapacityPercent() < request.getAllocationPercent()) {
            throw new IllegalStateException(String.format(
                    "Insufficient capacity: %s only has %d%% capacity available, but requested %d%%.",
                    employee.getName(),
                    employee.getAvailableCapacityPercent(),
                    request.getAllocationPercent()
            ));
        }

        // Reduce available capacity
        employee.setAvailableCapacityPercent(employee.getAvailableCapacityPercent() - request.getAllocationPercent());
        employeeRepository.save(employee);

        ProjectAssignment assignment = new ProjectAssignment();
        assignment.setProject(project);
        assignment.setEmployee(employee);
        assignment.setAssignedRole(request.getAssignedRole());
        assignment.setAllocationPercent(request.getAllocationPercent());
        assignment.setStartDate(request.getStartDate());
        assignment.setEndDate(request.getEndDate());

        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void removeAssignment(Long id) {
        ProjectAssignment assignment = getAssignmentById(id);
        Employee employee = assignment.getEmployee();

        // Restore employee available capacity
        int restoredCapacity = Math.min(
                employee.getTotalCapacityPercent(),
                employee.getAvailableCapacityPercent() + assignment.getAllocationPercent()
        );
        employee.setAvailableCapacityPercent(restoredCapacity);
        employeeRepository.save(employee);

        assignmentRepository.delete(assignment);
    }
}
