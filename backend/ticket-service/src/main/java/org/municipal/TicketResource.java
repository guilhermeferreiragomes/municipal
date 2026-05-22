package org.municipal;

import java.util.List;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;

@Path("/tickets") // URL for the tickets "localhost:8080/tickets"
@Produces(MediaType.APPLICATION_JSON) // Answer with Json
@Consumes(MediaType.APPLICATION_JSON) // Receive a Json
public class TicketResource {

    // Read the list of all tickets
    @GET
    public List<Ticket> getAllTickets() {
        return Ticket.listAll();
    }

    // Create a new ticket
    @POST
    public Response createTicket(Ticket t) {
        t.persist(); // To save into MongoDB
        return Response.status(Response.Status.CREATED).entity(t).build();
    }

    // Update an existing ticket
    @PUT
    @Path("/{id}")
    public Response updateTicketStatus(@PathParam("id") String id, Ticket ticketUpdate) {
        Ticket ticket = Ticket.findById(new ObjectId(id));
        if (ticket == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Ticket not found.").build();
        }

        ticket.status = ticketUpdate.status;

        // 🔴 NOVA LINHA: Atualiza também o técnico atribuído
        ticket.assignedTo = ticketUpdate.assignedTo;

        ticket.update();

        return Response.ok(ticket).build();
    }

    // Delete a ticket
    @DELETE
    @Path("/{id}")
    public Response deleteTicket(@PathParam("id") String id) {
        Ticket ticket = Ticket.findById(new ObjectId(id));
        if (ticket == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Ticket not found.").build();
        }

        ticket.delete(); // Deletes from MongoDB
        return Response.noContent().build();
    }
}