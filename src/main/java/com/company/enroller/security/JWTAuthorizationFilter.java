package com.company.enroller.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {
    static final String HEADER_NAME = "Authorization";
    static final String TOKEN_PREFIX = "Bearer ";
    private final JWTVerifier verifier;

    public JWTAuthorizationFilter(AuthenticationManager authManager, String secret) throws UnsupportedEncodingException {
        super(authManager);
        verifier = JWT.require(Algorithm.HMAC256(secret)).acceptExpiresAt(0).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        Cookie[] cookies = req.getCookies();
        if (cookies == null || cookies.length == 0) {
            chain.doFilter(req, res);
            return;
        }

        Optional<Cookie> cookie = Arrays.stream(cookies)
                .filter(c -> c.getName().equals(HEADER_NAME))
                .findFirst();
        if (cookie.isPresent()) {
            String token = cookie.get().getValue();
            Authentication authentication = extractUserFromToken(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(req, res);
    }

    private Authentication extractUserFromToken(String token) {
        String username = verifier.verify(token).getSubject();
        if (username != null) {
            return new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
        }
        return null;
    }
}