import Door from "./Door";
import Item from "./Item";

class Key extends Item {

    private _door: Door;

    constructor(name: string, description: string, modelPath: string, imagePath: string, door: Door) {
        super(name, description, modelPath, imagePath);
        this._door = door;
    }
}

export default Key;