export interface Ticket {
    id: string;
    museumId: string;
    typeId: string;
    amount: number;
    purchaseDate: Date;
}

export interface TicketType {
    id: string;
    museumId: string;
    type: string;
    price: number;
    description: string;
    pathToImage: string;
    image?: string;
}