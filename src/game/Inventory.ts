import InventoryFull from "../errors/game/InventoryErrors";

class Inventory {

    private _capacity: number;
    private _items: Item[];

    constructor(capacity: number) {
        this._capacity = capacity;
        this._items = [];
    }

    public addItem(item: Item): InventoryFull | void {
        if (this._capacity <= this._items.length) {
            this._items.push(item);
        } else {
            return new InventoryFull(this._capacity);
        }
    }

    public get items(): Item[] {
        return this._items;
    }

    public getItem(index: number): Item {
        return this._items[index];
    }

    public removeItem(index: number): void {
        this._items.splice(index, 1);
    }

}

export default Inventory;