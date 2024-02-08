export interface Event {
    id: string;
    title: string;
    description: string;
    museumId: string;
    startDate: Date;
    finishDate: Date;
    pathToImage: string;
    image?: string;
}
