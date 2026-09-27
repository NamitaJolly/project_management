package com.pms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("app", "TeamFlow - Engineering Project & Resource Allocation API");
        response.put("version", "1.0.0");
        response.put("swaggerUi", "/swagger-ui/index.html");
        response.put("apiDocs", "/v3/api-docs");
        return ResponseEntity.ok(response);
    }
}
