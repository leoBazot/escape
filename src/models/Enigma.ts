import { Scene } from "@babylonjs/core/scene";
import Item from "./Item";
import SceneHandler from "../scenes/SceneHandler";

class Enigma extends Item {
    private _isSolved: boolean;
    private _item: Item; // item needed to start the enigma
    private _scene: Scene;

    constructor(name: string) {
        super(name, "Enigme : " + name.replace("enigme", ""));
        this._isSolved = false;
    }

    public get isSolved(): boolean {
        return this._isSolved;
    }

    public set isSolved(isSolved: boolean) {
        this._isSolved = isSolved;
    }

    public set scene(scene: Scene) {
        this._scene = scene;
    }

    public use(mesh?: Item): void {
        if (mesh.equals(this._item)) {
            SceneHandler.instance.saveScene();

            SceneHandler.instance.currentScene = this._scene;
        }
    }
}

export default Enigma;