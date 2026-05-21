package org.municipal;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "users")
public class User extends PanacheMongoEntity {

    public String name;
    public String email;
    public String password;
    public String role;

    // Quarkus constructor
    public User() {
    }

    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
