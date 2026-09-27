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
        if (!user.getPassword().matches(".*[A-Z].*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one uppercase letter (A-Z)"));
        }
        if (!user.getPassword().matches(".*[a-z].*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one lowercase letter (a-z)"));
        }
        if (!user.getPassword().matches(".*\\d.*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one number (0-9)"));
        }
        if (!user.getPassword().matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?~`].*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one special character (!@#$%^&*)"));
        }
        String uname = user.getUsername().trim();
        String email = user.getEmail() != null ? user.getEmail().trim() : null;
        if (userRepository.existsByUsername(uname)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken"));
        }
        if (email != null && userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered"));
        }
        user.setUsername(uname);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_RMG");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "RMG User registered successfully"));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {
        String input = loginReq.getUsername() != null ? loginReq.getUsername().trim() : "";
        String pass = loginReq.getPassword() != null ? loginReq.getPassword() : "";
        User user = userRepository.findByUsernameOrEmail(input, input).orElse(null);
        if (user != null && passwordEncoder.matches(pass, user.getPassword())) {
            String token = jwtUtils.generateToken(user.getUsername());
            return ResponseEntity.ok(Map.of("token", token, "username", user.getUsername()));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid username/email or password"));
    }
}
