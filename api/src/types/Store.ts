import { RowDataPacket } from "mysql2";
import Item from "./Item";

export default interface Store {
    id: string;
    name: string;
    items: Item[];
}

export interface IStore extends RowDataPacket {
    id: string;
    name: string;
    items: Item[];
}
