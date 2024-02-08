export interface Museum {
    id: string;
    name: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
    };
    pathToImage: string;
    image?: string;
}
