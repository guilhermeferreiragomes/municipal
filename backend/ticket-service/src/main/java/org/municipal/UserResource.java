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

    @GET
    public List<User> getAllUsers(@QueryParam("role") String role) {
        if (role != null && !role.isEmpty()) {
            return userRepository.find("role", role).list();
        }
        return userRepository.listAll();
    }

    @POST
    public Response createUser(User user) {
        if (userRepository.findByEmail(user.email) != null) {
            return Response.status(Response.Status.CONFLICT).entity("Email already exists.").build();
        }

        userRepository.persist(user);
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

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

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") String id, User userUpdate) {
        User user = userRepository.findById(new ObjectId(id));
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        user.name = userUpdate.name;
        user.email = userUpdate.email;
        if (userUpdate.password != null && !userUpdate.password.isEmpty()) {
            user.password = userUpdate.password;
        }

        userRepository.update(user);
        return Response.ok(user).build();
    }
}