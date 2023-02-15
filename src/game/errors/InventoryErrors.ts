import Inventory from "../elements/Inventory";

class InventoryFullError extends Error {

    private _inventory: Inventory;

    constructor(inventory: Inventory) {
        super(`Inventory is full, You can only store ${inventory.capacity} items`);
        this._inventory = inventory;
    }
}

function createInventoryFullError(inventory: Inventory): InventoryFullError {
    return new InventoryFullError(inventory);
}

export { createInventoryFullError, InventoryFullError };