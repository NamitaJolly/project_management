package com.pms.service;

import com.pms.model.Employee;
import com.pms.model.Project;
import com.pms.model.ProjectAssignment;
import com.pms.model.ProjectStatus;
import com.pms.repository.EmployeeRepository;
import com.pms.repository.ProjectAssignmentRepository;
import com.pms.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectAssignmentRepository assignmentRepository,
                          EmployeeRepository employeeRepository) {
        this.projectRepository = projectRepository;
        this.assignmentRepository = assignmentRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project not found with id: " + id));
    }

    @Transactional
    public Project createProject(Project project) {
        if (project.getStatus() == null) {
            project.setStatus(ProjectStatus.PLANNING);
        }
        if (project.getRequiredSkills() == null) {
            project.setRequiredSkills(new ArrayList<>());
        }
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, Project updatedData) {
        Project project = getProjectById(id);

        project.setProjectName(updatedData.getProjectName());
        project.setClient(updatedData.getClient());
        project.setDescription(updatedData.getDescription());
        project.setStartDate(updatedData.getStartDate());
        project.setEndDate(updatedData.getEndDate());
        project.setStatus(updatedData.getStatus());
        project.setRequiredSkills(updatedData.getRequiredSkills() != null
                ? updatedData.getRequiredSkills()
                : new ArrayList<>());

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        List<ProjectAssignment> assignments = assignmentRepository.findByProjectId(id);
        for (ProjectAssignment assignment : assignments) {
            // Restore employee available capacity when project is deleted
            Employee employee = assignment.getEmployee();
            int restoredCapacity = Math.min(
                    employee.getTotalCapacityPercent(),
                    employee.getAvailableCapacityPercent() + assignment.getAllocationPercent()
            );
            employee.setAvailableCapacityPercent(restoredCapacity);
            employeeRepository.save(employee);
            assignmentRepository.delete(assignment);
        }
        projectRepository.delete(project);
    }
}
