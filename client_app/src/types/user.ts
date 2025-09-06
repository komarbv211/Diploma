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
    roles: string; 
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
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
}



export interface PagedRequestDto {
  page?: number;
  pageSize?: number;
  //додав
   sortBy?: string;     // ✅ додай це
  sortDesc?: boolean;  // ✅ і це
   searchName?: string; // 🔁 Замість "name"
}

export interface PaginationComponentProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export interface IUser {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  isLoginGoogle?: boolean;
  isLoginPassword?: boolean;
  createdDate: string;
  lastActivity: string;
  roles: string[];
  isBlocked: boolean;
  blockedUntil?: string;
}

// types/user.ts
export interface IUserListResponse {
  items: IUser[];
  totalCount: number;
}


export interface IUserMessageDTO {
    id: number;
    subject: string;
    message: string;
}


export interface UserBlockDTO
{
    id: number;
    until?: string;
}
