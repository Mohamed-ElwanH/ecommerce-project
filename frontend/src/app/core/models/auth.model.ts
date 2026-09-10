export interface ILoginData{
name: string;
password: string;
}

export interface ILoginResponse{
    message:string;
    token:string;
}
export interface ITokenPayload{
    id:string;
    name:string;
    role:string;
    iat:number;
    exp:number
}
