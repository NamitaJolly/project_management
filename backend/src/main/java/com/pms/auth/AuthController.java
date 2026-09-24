package com.pms.auth;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository; this.passwordEncoder = passwordEncoder; this.jwtUtils = jwtUtils;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is required"));
        }
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
            if (!user.getEmail().matches(emailRegex)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid email format. Example: user@company.com"));
            }
        }
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters long"));
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken"));
        }
        if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_RMG");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "RMG User registered successfully"));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {
        String input = loginReq.getUsername() != null ? loginReq.getUsername() : "";
        User user = userRepository.findByUsernameOrEmail(input, input).orElse(null);
        if (user != null && passwordEncoder.matches(loginReq.getPassword(), user.getPassword())) {
            String token = jwtUtils.generateToken(user.getUsername());
            return ResponseEntity.ok(Map.of("token", token, "username", user.getUsername()));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username/email or password"));
    }
}
