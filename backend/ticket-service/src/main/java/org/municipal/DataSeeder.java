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
            userRepository.persist(new User("John Doe", "citizen@test.com", "123456", "CITIZEN"));
            userRepository.persist(new User("Engineer Smith", "tech@test.com", "654321", "TECHNICIAN"));
            userRepository.persist(new User("Admin", "admin@admin.com", "admin", "ADMIN"));
            System.out.println("✅ Utilizadores base originais criados!");
        }

        if (userRepository.find("email", "citizen2@test.com").firstResult() == null) {
            User citizen2 = new User("John Segundo", "citizen2@test.com", "123456", "CITIZEN");
            userRepository.persist(citizen2);
            System.out.println("✅ Novo utilizador citizen2@test.com criado com sucesso!");
        } else {
            System.out.println("ℹ️ O citizen2 já existe na base de dados. Tudo pronto!");
        }
    }
}