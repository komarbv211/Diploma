export interface IUserDTO {
    id: number;
    email: string;
    userName: string;
    // додай інші поля за потребою
}
  
export interface IUserCreateDTO {
    email: string;
    password: string;
    // інші поля
}
  
export interface IUserUpdateDTO {
    id: number;
    email?: string;
    userName?: string;
    // інші поля
}
  