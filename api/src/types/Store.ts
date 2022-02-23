import Item from "./Item";

export default interface Store {
    id: string;
    name: string;
    items: Item[];
}
