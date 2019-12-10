export interface Coordinates {
    lat: number;
    lng: number;
}

export interface OfferLocation extends Coordinates{
    address: string;
    staticMapImageUrl: string;
}

export interface PlaceLocation extends Coordinates{
    address: string;
    staticMapImageUrl: string;
}