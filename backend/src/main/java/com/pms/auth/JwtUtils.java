package com.pms.auth;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
@Component
public class JwtUtils {
    private final String secret = "PulsePMISuperSecretKeyForRMGAllocators2024!!!";
    private final long expirationMs = 86400000; // 1 day
    private Key getSigningKey() { return Keys.hmacShaKeyFor(secret.getBytes()); }
    public String generateToken(String username) {
        return Jwts.builder().setSubject(username).setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody().getSubject();
    }
    public boolean validateToken(String token) {
        try { Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token); return true; } 
        catch (JwtException | IllegalArgumentException e) { return false; }
    }
}
