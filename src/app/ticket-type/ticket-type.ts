export interface TicketType {
  id: string;
  museumId: string;
  type: string;
  price: number;
  description: string;
  pathToImage: string;
  image?: string;
}

export interface Ticket {
  id: string;
  museumId: string;
  typeId: string;
  amount: number;
  purchaseDate: Date;
}