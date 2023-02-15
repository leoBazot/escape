import Inventory from "./Inventory";

class Player {
    private _name: string;
    private _inventory: Inventory;

    constructor(name: string, inventory: Inventory) {
        this._name = name;
        this._inventory = inventory;
    }

    public get name(): string {
        return this._name.toString();
    }

    public get inventory(): Inventory {
        return this._inventory;
    }
}