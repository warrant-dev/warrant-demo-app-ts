import { RowDataPacket } from "mysql2";

export default interface Item {
    id: number;
    storeId: number;
    name: string;
    description: string;
    price: number;
}

export interface IItem extends RowDataPacket {
    id: number;
    storeId: number;
    name: string;
    description: string;
    price: number;
}
