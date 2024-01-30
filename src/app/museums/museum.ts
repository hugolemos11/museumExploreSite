export interface Museum {
    id: string;
    name: string;
    description: string;
    rate: number;
    ticketsNumber: number;
    visits: number;
    location: {
        latitude: number;
        longitude: number;
    };
    pathToImage: string;
    image?: string;
}
