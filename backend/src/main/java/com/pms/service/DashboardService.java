package com.pms.service;

import com.pms.dto.DashboardSummaryDto;
import com.pms.model.Employee;
import com.pms.model.ProjectStatus;
import com.pms.repository.EmployeeRepository;
import com.pms.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public DashboardService(ProjectRepository projectRepository, EmployeeRepository employeeRepository) {
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
    }

    public DashboardSummaryDto getDashboardSummary() {
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long planningProjects = projectRepository.countByStatus(ProjectStatus.PLANNING);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);

        List<Employee> employees = employeeRepository.findAll();
        long totalEmployees = employees.size();

        int totalCapacity = 0;
        int availableCapacity = 0;

        for (Employee emp : employees) {
            totalCapacity += (emp.getTotalCapacityPercent() != null ? emp.getTotalCapacityPercent() : 100);
            availableCapacity += (emp.getAvailableCapacityPercent() != null ? emp.getAvailableCapacityPercent() : 0);
        }

        int allocatedCapacity = Math.max(0, totalCapacity - availableCapacity);

        double utilizationRate = 0.0;
        if (totalCapacity > 0) {
            utilizationRate = Math.round(((double) allocatedCapacity / totalCapacity) * 100.0 * 10.0) / 10.0;
        }

        return new DashboardSummaryDto(
                totalProjects,
                activeProjects,
                planningProjects,
                completedProjects,
                totalEmployees,
                utilizationRate,
                totalCapacity,
                allocatedCapacity,
                availableCapacity
        );
    }
}
