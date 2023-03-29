import Item from "../elements/Item";

class ItemController {
    private item: Item;


    constructor(item: Item) {
        this.item = item;
    }

    

    public transformItem(newModelPath: string, newTexturePath: string): void {
        this.item.model = newModelPath;
        this.item.texture = newTexturePath;
    }
}

export default ItemController;