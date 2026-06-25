package br.com.app.quero_pecas.config;

import br.com.app.quero_pecas.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    public JwtFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                var decodedJWT = tokenService.validarEObterToken(token);
                String email = decodedJWT.getSubject();
                String role = decodedJWT.getClaim("role").asString();

                java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = null;
                if (role != null) {
                    authorities = java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role));
                }

                var auth = new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (RuntimeException e) {
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
                return;
            }
        }
        filterChain.doFilter(req, res);
    }
}