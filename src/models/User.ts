export enum Role {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN' ,
    STOREMAN = 'STOREMAN',
    COMMERCIAL = 'COMMERCIAL'
}

export interface IUser{
    id?: string,
    name: string,
    firstname?: string,
    phoneNumber: string,
    email: string,
    password?: string,
    role: Role,
    createdAt?: number,
    updatedAt?: number
}

export interface IUserAuth{
    email: string,
    password: string
}


export interface IAuthenticatedUser{
    name: string;
    firstname?: string;
    email: string;
    role: Role;
}

export class AuthenticatedUser implements IAuthenticatedUser{
    name: string;
    firstname?: string;
    email: string;
    role: Role;

    constructor(params: IAuthenticatedUser){
        this.name = params.name;
        this.firstname = params.firstname;
        this.email = params.email;
        this.role = params.role;
    }

    handleRole(){
        switch (this.role){
            case Role.ADMIN :
                return 'adminDashboard'
            case Role.CLIENT :
                return 'home'
            case Role.COMMERCIAL :
                return 'adminDashboard'
            case Role.STOREMAN :
                return 'adminDashboard'
            default :
                return 'home'
        }
    }

    get getFullName(){
        return `${this.firstname} ${this.name}`
    }
}