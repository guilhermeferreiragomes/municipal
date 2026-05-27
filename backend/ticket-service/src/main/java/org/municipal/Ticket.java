package org.municipal;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import java.time.LocalDateTime;

public class Ticket extends PanacheMongoEntity {

    public enum TicketStatus {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        REJECTED,
    }

    public String title;
    public String description;
    public TicketStatus status;
    public String imageUrl;
    public LocalDateTime createdAt;
    public String assignedTo;
    public Double latitude;
    public Double longitude;
    public String category;
    public String priority;
    public String createdBy;

    public Ticket() {
        this.createdAt = LocalDateTime.now();
        this.status = TicketStatus.OPEN;
        this.assignedTo = ""; // Empty by default
        this.category = "OTHER";
        this.priority = "LOW"; // Low urgency by default
        this.createdBy = "anonymous"; // By default
    }
}