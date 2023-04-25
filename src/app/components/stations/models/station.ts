export interface Station{
    id:number,
    name:string,
    orderNumber:number,
    duration:number,
    price:number,
    stopTime:number,
    location:string,
    routeId:number[],
    isActive:boolean
}