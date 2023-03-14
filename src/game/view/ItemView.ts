import { Scene, SceneLoader } from "@babylonjs/core";
import Item from "../elements/Item";

class ItemView {
    private scene: Scene;
    private item: Item;

    constructor(scene: Scene, item: Item) {
        this.item = item;
        this.scene = scene;
    }

    public displayItem(): void {
        SceneLoader.ImportMesh(
            this.item.name,
            this.item.model,
            this.item.description,
            this.scene,
        );
    }

    public hideItem(): void {
        this.scene.getMeshById(this.item.name).dispose();
    }
}

export default Item;