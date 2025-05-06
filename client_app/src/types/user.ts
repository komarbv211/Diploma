export interface IUserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    image: string;
    createdDate: string;
    lastActivity: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
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
  