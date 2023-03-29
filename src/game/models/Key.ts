import { Vector3 } from "@babylonjs/core";
import Door from "./Door";
import Item from "./Item";

class Key extends Item {

    private _door: Door;

    constructor(name: string, description: string, modelPath: string, texturePath: string, iconPath: string, position: Vector3, door: Door) {
        super(name, description, modelPath, texturePath, iconPath, position);
        this._door = door;
    }
}

export default Key;