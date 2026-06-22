package com.company.enroller.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;


@Service
public class JwtService {
    private final String HEADER_NAME = "Authorization";
    private final String secret;
    private final JWTVerifier jwtVerifier;

    @Value("${security.issuer}")
    private String issuer;

    @Value("${security.token_expiration_in_seconds}")
    private int tokenExpiration;

    public JwtService(@Value("${security.secret}") String secret) {
        this.secret = secret;
        this.jwtVerifier = JWT.require(Algorithm.HMAC256(secret)).acceptExpiresAt(0).build();
    }

    public String extractJwtFromCookies(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        if (cookies == null) {
            return null;
        }
        return Arrays.stream(cookies)
                .filter(c -> c.getName().equals(HEADER_NAME))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public Authentication extractUserFromJwt(String jwt) {
        String username = jwtVerifier.verify(jwt).getSubject();
        if (username != null) {
            return new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
        }
        return null;
    }

    private String createJwt(String login) {
        LocalDateTime now = LocalDateTime.now();
        return JWT.create()
                .withIssuer(issuer)
                .withSubject(login)
                .withIssuedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()))
                .withExpiresAt(Date.from(now.plusSeconds(tokenExpiration).atZone(ZoneId.systemDefault()).toInstant()))
                .withClaim("role", "participant")
                .sign(Algorithm.HMAC256(secret));
    }

    public Cookie createJwtCookie(String login) {
        String jwt = createJwt(login);
        Cookie cookie = new Cookie(HEADER_NAME, jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(tokenExpiration);
        return cookie;
    }

}
