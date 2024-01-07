export interface Museum {
    id?: string;
    name: string;
    nameSearch: string;
    description: string;
    rate: Number;
    ticketsNumber: Number;
    visits: Number;
    latitude: Number;
    longitude: Number;
    pathToImage?: string;
}
