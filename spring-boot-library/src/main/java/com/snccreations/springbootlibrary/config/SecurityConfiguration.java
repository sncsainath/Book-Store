package com.snccreations.springbootlibrary.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

import com.okta.spring.boot.oauth.Okta;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Value("${okta.oauth2.client-id}")
    private String clientId;

    @Value("${okta.oauth2.issuer}")
    private String issuer;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize ->
                authorize
                    .requestMatchers("/api/books/secure/**","/api/reviews/secure/**","/api/messages/secure/**","/api/admin/secure/**").authenticated()
                    .anyRequest().permitAll())
            .oauth2ResourceServer(oauth2ResourceServer ->
                oauth2ResourceServer
                    .jwt(jwt -> jwt
                        .jwkSetUri(issuer + "/v1/keys")));

        // Enable CORS
        http.cors();

        // Disable CSRF for simplicity, but you might want to configure it properly in a real app
        http.csrf().disable();

        // Set the content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Configure custom 401 response body for Okta
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }
}
