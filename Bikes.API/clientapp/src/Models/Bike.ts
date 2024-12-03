export enum BikeSize {
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
}

export enum BikeType {
    Mountain = 'Mountain',
    Road = 'Road',
    Hybrid = 'Hybrid',
    Electric = 'Electric',
}

export interface Reservation {
    id: string;
    startDate: string; 
    endDate: string; 
    bikeId: string;
}

export interface Feedback {

    id: string;
    bikeId: string;
    rating: number; 
    comment: string;
}

export interface Damage {

    id: string;
    description: string;
    dateReported: string; 
    bikeId: string;
}

export interface Availability {
    id: string;
    bikeId: string;
    availableFrom: string; 
    availableTo: string;
}

export interface Bike {
    id: string; 
    name: string;
    size: BikeSize;
    type: BikeType; 
    isElectric: boolean;
    hourlyRate: number;
    dailyRate: number;
    availabilityStatus: boolean;

}

export default Bike;