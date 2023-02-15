class InventoryFull extends Error {
    constructor(capacity: number) {
        super(`Inventory is full, You can only store ${capacity} items`);
    }
}

export default InventoryFull;