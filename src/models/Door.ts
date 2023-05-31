import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import Item from "./Item";
import Key from "./Key";
import { doorClosedDefaultDialog } from "../display/DialogHandler";

class Door extends Item {

    private _isLocked: boolean;
    private _key: Key;

    constructor(mesh: AbstractMesh, name: string) {
        super(mesh, name, "Porte de la salle : " + name.replace("porte", ""));
        this._isLocked = true;
        this._key = undefined;
    }

    public get isLocked(): boolean {
        return this._isLocked;
    }

    public set key(key: Key) {
        this._key = key;
    }

    public open(key: Key): boolean {
        if (key?.equals(this._key)) {
            this._isLocked = false;
            this._mesh.dispose();
            return true
        } else {
            doorClosedDefaultDialog();
            return false;
        }
    }

    public forceOpen(): void {
        this._isLocked = false;
        this._mesh.dispose();
    }

    public use(mesh?: Item): boolean {
        return this.open(mesh as Key);
    }
}

export default Door;