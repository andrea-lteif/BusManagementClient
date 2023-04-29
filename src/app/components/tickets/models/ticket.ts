export interface Ticket{
    id:number,
    busId:number,
    userId:string,
    tripId:number,
    stationId:number[],
    seatId:number,
    routeId:number,
    date:string,
    price:number,
    isActive:boolean
}