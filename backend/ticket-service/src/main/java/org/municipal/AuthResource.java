package org.municipal;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UserRepository userRepository;

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email);

        if (user == null || !user.password.equals(request.password)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("Email or password incorrect."))
                    .build();
        }
        return Response.ok(user).build();
    }

    public static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }
}