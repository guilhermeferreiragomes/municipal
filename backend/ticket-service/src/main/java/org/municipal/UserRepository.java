package org.municipal;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheMongoRepository<User> {

    // Search on MongoDB de user by his email
    public User findByEmail(String email) {
        return find("email", email).firstResult();
    }
}