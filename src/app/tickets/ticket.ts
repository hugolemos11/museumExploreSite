export interface Ticket {
    id: string;
    museumId: string;
    ticketTypeId: string;
    purchaseDate: Date;
}

export interface TicketType {
    id: string;
    museumId: string;
    type: string;
}