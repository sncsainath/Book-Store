package com.snccreations.springbootlibrary.config;

import com.snccreations.springbootlibrary.entity.Book;
import com.snccreations.springbootlibrary.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private static final String[] ALLOWED_ORIGINS = { "http://localhost:3000", "http://192.168.29.92:3000","http://snccreations.s3-website.eu-north-1.amazonaws.com" };

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = { HttpMethod.POST, HttpMethod.PATCH, HttpMethod.PUT, HttpMethod.DELETE };

        // Expose entity IDs
        config.exposeIdsFor(Book.class, Review.class);

        // Disable HTTP methods for entities: POST, PATCH, PUT, DELETE
        disableHttpMethods(Book.class, config, unsupportedActions);
        disableHttpMethods(Review.class, config, unsupportedActions);

        // Configure CORS mapping
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(ALLOWED_ORIGINS);
    }

    private void disableHttpMethods(Class<?> clazz, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
              .forDomainType(clazz)
              .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
              .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }
}
