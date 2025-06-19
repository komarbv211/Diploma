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

    birthDate?: string;       // додано для дати народження, необов’язкове поле
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
  
export interface PagedResultDto<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export interface PagedRequestDto {
  page?: number;
  pageSize?: number;
}

export interface PaginationComponentProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number, pageSize: number) => void;
}