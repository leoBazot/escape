import { WrongKeyError, createWrongKeyError } from "../errors/DoorErrors";
import Item from "./Item";
import Key from "./Key";

class Door extends Item {

    private _isLocked: boolean;
    private _key: Key;

    constructor(name: string) {
        super(name, "Porte de la salle : " + name.replace("porte", ""));
        this._isLocked = true;
        this._key = undefined;
    }

    public get isLocked(): boolean {
        return this._isLocked;
    }

    public set key(key: Key) {
        this._key = key;
    }

    public open(key: Key): WrongKeyError | void {
        if (key.equals(this._key)) {
            this._isLocked = false;
            this._mesh.dispose();
        } else {
            return createWrongKeyError(this);
        }
    }

    public use(mesh?: Item): void {
        this.open(this._key);
    }
}

export default Door;