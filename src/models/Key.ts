import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import Door from "./Door";
import PickableItem from "./PickableItem";

class Key extends PickableItem {

    private _door: Door;

    constructor(mesh: AbstractMesh, name: string) {
        super(mesh, name, "Clé de la porte : " + name.replace("badge", ""), "./images/pickable/" + name + ".png");
        this._door = undefined;
    }

    public set door(door: Door) {
        this._door = door;
    }

    public use(): boolean {
        return false;
    }
}

export default Key;