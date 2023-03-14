import { WrongKeyError, createWrongKeyError } from "../errors/DoorErrors";
import Item from "./Item";
import Key from "./Key";

class Door extends Item {

    private _isLocked: boolean;
    private _key: Key;

    constructor(name: string, description: string, modelPath: string, imagePath: string, key: Key) {
        super(name, description, modelPath, imagePath);
        this._isLocked = true;
        this._key = key;
    }

    public get isLocked(): boolean {
        return this._isLocked;
    }

    public open(key: Key): WrongKeyError | void {
        if (key === this._key) {
            this._isLocked = false;
        } else {
            return createWrongKeyError(this);
        }
    }
}

export default Door;