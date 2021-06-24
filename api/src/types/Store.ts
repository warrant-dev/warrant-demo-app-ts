import Item from "./Item";

export default interface Store {
    id: number;
    userId: number;
    name: string;
    items: Item[];
}
