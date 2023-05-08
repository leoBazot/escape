import Door from "./Door";
import PickableItem from "./PickableItem";

class Key extends PickableItem {

    private _door: Door;

    constructor(name: string) {
        super(name, "Clé de la porte : " + name.replace("clef", ""), "./images/key_" + name.replace("clef", "") + ".png");
        this._door = undefined;
    }

    public set door(door: Door) {
        this._door = door;
    }

    public use(): void {
        this._door.open(this);
    }
}

export default Key;