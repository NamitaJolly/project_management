package com.pms.service;

import com.pms.dto.EmployeeSkillMatchDto;
import com.pms.model.Employee;
import com.pms.repository.EmployeeRepository;
import com.pms.repository.ProjectAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ProjectAssignmentRepository assignmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           ProjectAssignmentRepository assignmentRepository) {
        this.employeeRepository = employeeRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Employee not found with id: " + id));
    }

    @Transactional
    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Employee with email '" + employee.getEmail() + "' already exists");
        }
        if (employee.getTotalCapacityPercent() == null) {
            employee.setTotalCapacityPercent(100);
        }
        if (employee.getAvailableCapacityPercent() == null) {
            employee.setAvailableCapacityPercent(employee.getTotalCapacityPercent());
        }
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, Employee updatedData) {
        Employee employee = getEmployeeById(id);

        if (employeeRepository.existsByEmailAndIdNot(updatedData.getEmail(), id)) {
            throw new IllegalArgumentException("Another employee already has email: " + updatedData.getEmail());
        }

        employee.setName(updatedData.getName());
        employee.setEmail(updatedData.getEmail());
        employee.setDesignation(updatedData.getDesignation());
        employee.setSkills(updatedData.getSkills() != null ? updatedData.getSkills() : new ArrayList<>());
        employee.setExperienceYears(updatedData.getExperienceYears());

        if (updatedData.getTotalCapacityPercent() != null) {
            employee.setTotalCapacityPercent(updatedData.getTotalCapacityPercent());
        }
        if (updatedData.getAvailableCapacityPercent() != null) {
            employee.setAvailableCapacityPercent(updatedData.getAvailableCapacityPercent());
        }

        return employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        // Clean up assignments referencing this employee
        assignmentRepository.findByEmployeeId(id).forEach(assignmentRepository::delete);
        employeeRepository.delete(employee);
    }

    public List<EmployeeSkillMatchDto> searchEmployees(List<String> requiredSkills,
                                                       Integer minExperience,
                                                       Integer minAvailableCapacity) {
        int experienceFilter = minExperience != null ? minExperience : 0;
        int capacityFilter = minAvailableCapacity != null ? minAvailableCapacity : 0;

        List<Employee> allEmployees = employeeRepository.findAll();

        // Standardize required skills for case-insensitive matching
        List<String> cleanRequiredSkills = (requiredSkills != null)
                ? requiredSkills.stream()
                .filter(s -> s != null && !s.trim().isEmpty())
                .map(String::trim)
                .collect(Collectors.toList())
                : Collections.emptyList();

        List<EmployeeSkillMatchDto> matchResults = new ArrayList<>();

        for (Employee employee : allEmployees) {
            // Check experience & capacity threshold
            if (employee.getExperienceYears() < experienceFilter) {
                continue;
            }
            if (employee.getAvailableCapacityPercent() < capacityFilter) {
                continue;
            }

            Set<String> empSkillsLower = employee.getSkills().stream()
                    .map(s -> s.trim().toLowerCase())
                    .collect(Collectors.toSet());

            List<String> matched = new ArrayList<>();
            List<String> missing = new ArrayList<>();

            if (!cleanRequiredSkills.isEmpty()) {
                for (String reqSkill : cleanRequiredSkills) {
                    if (empSkillsLower.contains(reqSkill.toLowerCase())) {
                        matched.add(reqSkill);
                    } else {
                        missing.add(reqSkill);
                    }
                }
            } else {
                matched.addAll(employee.getSkills());
            }

            int matchCount = matched.size();
            double matchPercentage = 0.0;
            if (!cleanRequiredSkills.isEmpty()) {
                matchPercentage = Math.round(((double) matchCount / cleanRequiredSkills.size()) * 100.0 * 100.0) / 100.0;
            } else {
                matchPercentage = 100.0;
            }

            matchResults.add(new EmployeeSkillMatchDto(employee, matched, missing, matchCount, matchPercentage));
        }

        // Rank by matchPercentage desc, then experienceYears desc, then availableCapacityPercent desc
        matchResults.sort(Comparator
                .comparingDouble(EmployeeSkillMatchDto::getMatchPercentage).reversed()
                .thenComparing((EmployeeSkillMatchDto dto) -> dto.getEmployee().getExperienceYears()).reversed()
                .thenComparing((EmployeeSkillMatchDto dto) -> dto.getEmployee().getAvailableCapacityPercent()).reversed());

        return matchResults;
    }
}
