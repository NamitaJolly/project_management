package com.pms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employee name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Designation is required")
    @Column(nullable = false)
    private String designation;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_skills", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @NotNull(message = "Experience years is required")
    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears;

    @Column(name = "total_capacity_percent", nullable = false)
    private Integer totalCapacityPercent = 100;

    @Column(name = "available_capacity_percent", nullable = false)
    private Integer availableCapacityPercent = 100;

    public Employee() {
    }

    public Employee(Long id, String name, String email, String designation, List<String> skills,
                    Integer experienceYears, Integer totalCapacityPercent, Integer availableCapacityPercent) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.designation = designation;
        this.skills = skills != null ? skills : new ArrayList<>();
        this.experienceYears = experienceYears;
        this.totalCapacityPercent = totalCapacityPercent != null ? totalCapacityPercent : 100;
        this.availableCapacityPercent = availableCapacityPercent != null ? availableCapacityPercent : 100;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Integer getTotalCapacityPercent() {
        return totalCapacityPercent;
    }

    public void setTotalCapacityPercent(Integer totalCapacityPercent) {
        this.totalCapacityPercent = totalCapacityPercent;
    }

    public Integer getAvailableCapacityPercent() {
        return availableCapacityPercent;
    }

    public void setAvailableCapacityPercent(Integer availableCapacityPercent) {
        this.availableCapacityPercent = availableCapacityPercent;
    }
}
