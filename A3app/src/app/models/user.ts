export class User {
    userId: string;
    email: string;
    password: string;
    fullname: string;
    role: 'chef' | 'admin' | 'manager';
    phone: string;
    constructor(){
        this.userId = '';
        this.email = '';
        this.password = '';
        this.fullname = '';
        this.role = 'admin';
        this.phone = '';
    }
}