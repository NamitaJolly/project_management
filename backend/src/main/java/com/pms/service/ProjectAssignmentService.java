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

        int alloc = request.getAllocationPercent() != null ? request.getAllocationPercent() : 100;
        int avail = employee.getAvailableCapacityPercent() != null ? employee.getAvailableCapacityPercent() : 100;

        // Update employee available capacity
        employee.setAvailableCapacityPercent(Math.max(0, avail - alloc));
        employeeRepository.save(employee);

        ProjectAssignment assignment = new ProjectAssignment();
        assignment.setProject(project);
        assignment.setEmployee(employee);
        assignment.setAssignedRole(request.getAssignedRole());
        assignment.setAllocationPercent(alloc);
        assignment.setStartDate(request.getStartDate());
        assignment.setEndDate(request.getEndDate());

        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void removeAssignment(Long id) {
        ProjectAssignment assignment = getAssignmentById(id);
        Employee employee = assignment.getEmployee();

        // Restore employee available capacity
        int total = employee.getTotalCapacityPercent() != null ? employee.getTotalCapacityPercent() : 100;
        int current = employee.getAvailableCapacityPercent() != null ? employee.getAvailableCapacityPercent() : 0;
        int alloc = assignment.getAllocationPercent() != null ? assignment.getAllocationPercent() : 100;
        employee.setAvailableCapacityPercent(Math.min(total, current + alloc));
        employeeRepository.save(employee);

        assignmentRepository.delete(assignment);
    }
}
