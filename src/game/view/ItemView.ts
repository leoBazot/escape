import { Scene, SceneLoader, ISceneLoaderAsyncResult, Space, Vector3 } from "@babylonjs/core";
import Item from "../models/Item";

class ItemView {
    private scene: Scene;
    private item: Item;
    private mesh: ISceneLoaderAsyncResult;

    constructor(scene: Scene, item: Item) {
        this.item = item;
        this.scene = scene;
    }

    public async displayItem(): Promise<void> {
        
        //SceneLoader.AppendAsync(this.item.model, this.item.description, this.scene);
        this.mesh = await SceneLoader.ImportMeshAsync(
            "",
            this.item.model,
            this.item.description,
            this.scene
        );
    }

    public majPosition(): void {
        this.mesh.meshes.map(m => {
            m.position = this.item.position;
        });
    }

    public redimensionner (vector: Vector3): void{
        this.mesh.meshes.map((m) => {
            m.scaling = vector;
        });
    }

    public hideItem(): void {
        this.scene.getMeshById(this.item.name).dispose();
    }
}

export default ItemView;