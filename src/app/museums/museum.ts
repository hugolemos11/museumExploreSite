export interface Museum {
    id: string;
    name: string;
    description: string;
    rate: Number;
    ticketsNumber: Number;
    visits: Number;
    latitude: Number;
    longitude: Number;
    pathToImage: string;
    image?: string;
}
