package com.company.enroller.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {
    private final JwtService jwtService;

    public JwtAuthorizationFilter(AuthenticationManager authManager, JwtService jwtService) {
        super(authManager);
        this.jwtService = jwtService;
    }

@Override
protected boolean shouldNotFilter(HttpServletRequest req){
    return req.getServletPath().equals("/participants") && req.getMethod().equals("POST");
}

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String jwt = jwtService.extractJwtFromCookies(req);
        if (jwt != null) {
            jwtService.extractUserFromJwt(jwt);
        }
        chain.doFilter(req, res);
    }

}