export interface Artwork {
    id: string;
    name: string;
    artist: string;
    year: number;
    categoryId: string;
    description: string;
    museumId: string;
    pathToImage: string;
    image?: string;
    additionalImages?: string[];
}
