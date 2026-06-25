package br.com.app.quero_pecas.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    req.requestMatchers("/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll();
                    req.requestMatchers(
                            "/", "/index.html", "/login.html", "/admin-login.html", "/cadastro.html", // LOGIN SCREEN
                            "/dashboard.html", "/busca-cliente.html", "/carrinho.html", "/pedidos.html", // PORTAL CLIENTE
                            "/admin-veiculo.html", "/busca-admin.html", "/admin-fornecedor.html", "/admin-pecas.html", "/admin-acesso.html", "/admin-estoque.html", "/admin-pedidos.html", // PORTAL ADMIN
                            "/pagamento-simulado.html",
                            "/busca.html" // PAGINA LEGADO
                    ).permitAll();

                    req.requestMatchers("/auth/**", "/usuarios/", "/fabricantes/**", "/pedidos/**", "/error","/orcamentos/**").permitAll();
                    req.requestMatchers("/veiculos/**", "/pecas/**", "/usuarios/me", "/veiculos/findByPlaca").authenticated();
                    req.anyRequest().authenticated();
                })
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }));
        return http.build();
    }
}
