package org.municipal;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import java.time.LocalDateTime;

public class Ticket extends PanacheMongoEntity {

    public enum TicketStatus {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
    }

    public String title;
    public String description;
    public TicketStatus status;
    public String imageUrl;
    public LocalDateTime createdAt;

    // Construtor
    public Ticket() {
        this.createdAt = LocalDateTime.now();
        this.status = TicketStatus.OPEN;
    }
}