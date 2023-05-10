import Inventory from "./Inventory";

class Player {
    private _name: string;
    private _inventory: Inventory;

    constructor(name: string, inventoryCapacity: number) {
        this._name = name;
        this._inventory = new Inventory(inventoryCapacity);
    }

    public get name(): string {
        return this._name.toString();
    }

    public get inventory(): Inventory {
        return this._inventory;
    }
}

export { Player };