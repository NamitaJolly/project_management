package com.pms.dto;

public class DashboardSummaryDto {

    private long totalProjects;
    private long activeProjects;
    private long planningProjects;
    private long completedProjects;
    private long totalEmployees;
    private double resourceUtilizationRate;
    private int totalCapacity;
    private int allocatedCapacity;
    private int availableCapacity;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(long totalProjects, long activeProjects, long planningProjects,
                               long completedProjects, long totalEmployees, double resourceUtilizationRate,
                               int totalCapacity, int allocatedCapacity, int availableCapacity) {
        this.totalProjects = totalProjects;
        this.activeProjects = activeProjects;
        this.planningProjects = planningProjects;
        this.completedProjects = completedProjects;
        this.totalEmployees = totalEmployees;
        this.resourceUtilizationRate = resourceUtilizationRate;
        this.totalCapacity = totalCapacity;
        this.allocatedCapacity = allocatedCapacity;
        this.availableCapacity = availableCapacity;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getPlanningProjects() {
        return planningProjects;
    }

    public void setPlanningProjects(long planningProjects) {
        this.planningProjects = planningProjects;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(long completedProjects) {
        this.completedProjects = completedProjects;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public double getResourceUtilizationRate() {
        return resourceUtilizationRate;
    }

    public void setResourceUtilizationRate(double resourceUtilizationRate) {
        this.resourceUtilizationRate = resourceUtilizationRate;
    }

    public int getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(int totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public int getAllocatedCapacity() {
        return allocatedCapacity;
    }

    public void setAllocatedCapacity(int allocatedCapacity) {
        this.allocatedCapacity = allocatedCapacity;
    }

    public int getAvailableCapacity() {
        return availableCapacity;
    }

    public void setAvailableCapacity(int availableCapacity) {
        this.availableCapacity = availableCapacity;
    }
}
