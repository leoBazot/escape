import Inventory from "../elements/Inventory";
import { createInventoryFullError, InventoryFullError } from "../errors/InventoryErrors";
import Item from "../elements/Item";

class InventoryController {
    private inventory: Inventory;


    constructor(inventory: Inventory) {
        this.inventory = inventory;
    }

    public ajoutItem(item: Item): InventoryFullError | void {
        if (this.inventory.items.length+1 <= this.inventory.capacity){
            this.inventory.items.push(item);
        }
        else {
            return createInventoryFullError(this.inventory);
        }
    }

    public retirerItem(item: Item): void {
        if (this.existItem(item)){
            var index = this.inventory.items.indexOf(item);
            this.inventory.items.splice(index, 1);
        }
        else {
            //l'objet n'existe pas jeter une exception
        }
    }

    public getItem(indice: number): Item {
        return this.inventory.items[indice];
    }

    public existItem (item: Item): boolean {
        if (this.inventory.items.indexOf(item) == -1) {
            return false;
        }
        return true;
    }
}

export default InventoryController;