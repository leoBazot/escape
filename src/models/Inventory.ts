import { createInventoryFullError, InventoryFullError } from "../errors/InventoryErrors";
import PickableItem from "./PickableItem";

class Inventory {
    private _capacity: number;
    private _items: PickableItem[];
    private _selectedItem: number;

    constructor(capacity: number) {
        this._capacity = capacity;
        this._items = [];
        this._selectedItem = 0;
    }

    public addItem(item: PickableItem): InventoryFullError | void {
        if (this._capacity > this._items.length) {
            this._items.push(item);
        } else {
            return createInventoryFullError(this);
        }
    }

    public get items(): PickableItem[] {
        return this._items;
    }

    public get capacity(): number {
        return this._capacity;
    }

    public set selectedItem(index: number) {
        if (index >= 0 && index < this._capacity) {
            this._selectedItem = index;
        } else {
            throw new Error("Inventory : Index out of bounds");
        }
    }

    public getItem(index: number): PickableItem {
        return this._items[index];
    }

    public removeItem(index: number): void {
        this._items.splice(index, 1);
    }

    public getSelectedItem(): PickableItem {
        return this._items[this._selectedItem];
    }

    public get selectedItem(): number {
        return this._selectedItem;
    }
}

export default Inventory;