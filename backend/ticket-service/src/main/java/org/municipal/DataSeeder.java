package org.municipal;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

@ApplicationScoped
public class DataSeeder {

    @Inject
    UserRepository userRepository;

    void onStart(@Observes StartupEvent ev) {

        if (userRepository.count() == 0) {

            // Creates the user objects in memory with English details
            User citizen = new User("John Doe", "citizen@test.com", "123456", "CITIZEN");
            User technician = new User("Engineer Smith", "tech@test.com", "654321", "TECHNICIAN");

            // Persists them in MongoDB
            userRepository.persist(citizen);
            userRepository.persist(technician);

            System.out.println("✅ Test users successfully created in MongoDB!");
        } else {
            System.out.println("ℹ️ Database already contains users. Skipping creation...");
        }
    }
}