package com.pms.controller;

import com.pms.dto.AssignmentRequest;
import com.pms.model.ProjectAssignment;
import com.pms.service.ProjectAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class ProjectAssignmentController {

    private final ProjectAssignmentService assignmentService;

    public ProjectAssignmentController(ProjectAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectAssignment>> getAssignments(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long employeeId) {

        if (projectId != null) {
            return ResponseEntity.ok(assignmentService.getAssignmentsByProjectId(projectId));
        }
        if (employeeId != null) {
            return ResponseEntity.ok(assignmentService.getAssignmentsByEmployeeId(employeeId));
        }
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectAssignment> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    /**
     * Assignment API: Map an employee to a project requirement,
     * automatically reducing their availableCapacityPercent.
     */
    @PostMapping
    public ResponseEntity<ProjectAssignment> createAssignment(@Valid @RequestBody AssignmentRequest request) {
        ProjectAssignment created = assignmentService.assignEmployeeToProject(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.removeAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
