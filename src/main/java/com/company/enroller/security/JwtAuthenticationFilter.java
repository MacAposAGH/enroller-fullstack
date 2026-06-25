package com.company.enroller.security;

import com.company.enroller.model.Participant;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;


public class JwtAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtService jwtService) {
        super(new AntPathRequestMatcher("/login", HttpMethod.POST.name()));
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException {
        Participant participant;
        try {
            participant = new ObjectMapper().readValue(req.getInputStream(), Participant.class);
        } catch (IOException e) {
            throw new BadCredentialsException("Invalid login request.", e);
        }

        String password = participant.getPassword();
        if (password != null) {
            Authentication authentication = new UsernamePasswordAuthenticationToken(participant.getLogin(), password, new ArrayList<>());
            return authenticationManager.authenticate(authentication);
        }
        String jwt = jwtService.extractJwtFromCookies(req);
        if (jwt == null) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return null;
//        jwtService.extractUserFromJwt(jwt);
//        return SecurityContextHolder.getContext().getAuthentication();
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication auth) throws IOException {
        String login = ((UserDetails) auth.getPrincipal()).getUsername();
        Cookie cookie = jwtService.createJwtCookie(login);
        res.getWriter().write(String.format("{\"login\": \"%s\"}", login));
        res.addCookie(cookie);
    }
}