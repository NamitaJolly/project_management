package com.pms.dto;

import com.pms.model.Employee;
import java.util.List;

public class EmployeeSkillMatchDto {

    private Employee employee;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private int matchCount;
    private double matchPercentage;

    public EmployeeSkillMatchDto() {
    }

    public EmployeeSkillMatchDto(Employee employee, List<String> matchedSkills,
                                 List<String> missingSkills, int matchCount, double matchPercentage) {
        this.employee = employee;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.matchCount = matchCount;
        this.matchPercentage = matchPercentage;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public int getMatchCount() {
        return matchCount;
    }

    public void setMatchCount(int matchCount) {
        this.matchCount = matchCount;
    }

    public double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }
}
