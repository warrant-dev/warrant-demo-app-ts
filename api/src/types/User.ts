import { RowDataPacket } from "mysql2";

export default interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

export interface IUser extends RowDataPacket {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}
