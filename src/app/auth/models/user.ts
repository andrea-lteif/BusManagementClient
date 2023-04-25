export interface User
{
    id : string;
    email : string;
    accessToken : string;
    refreshToken : string;
    validTo : Date;
    claim: string;
}