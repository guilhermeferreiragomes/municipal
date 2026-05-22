package org.municipal;

import java.util.List;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserRepository userRepository;

    // Retorna todos os utilizadores (ou filtra por função, ex: ?role=TECHNICIAN)
    @GET
    public List<User> getAllUsers(@QueryParam("role") String role) {
        if (role != null && !role.isEmpty()) {
            return userRepository.find("role", role).list();
        }
        return userRepository.listAll();
    }

    // Cria um novo utilizador
    @POST
    public Response createUser(User user) {
        // Valida se o email já existe usando o teu método do UserRepository
        if (userRepository.findByEmail(user.email) != null) {
            return Response.status(Response.Status.CONFLICT).entity("Email already exists.").build();
        }

        userRepository.persist(user);
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

    // Apaga um utilizador pelo ID
    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") String id) {
        User user = userRepository.findById(new ObjectId(id));
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        userRepository.delete(user);
        return Response.noContent().build();
    }

    // Atualiza um utilizador existente (Editar)
    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") String id, User userUpdate) {
        User user = userRepository.findById(new ObjectId(id));
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        user.name = userUpdate.name;
        user.email = userUpdate.email;

        // Só atualiza a password se o admin tiver escrito uma nova
        if (userUpdate.password != null && !userUpdate.password.isEmpty()) {
            user.password = userUpdate.password;
        }

        userRepository.update(user); // Guarda as alterações no MongoDB
        return Response.ok(user).build();
    }
}