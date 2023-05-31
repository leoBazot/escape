import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

import Item from "./Item";
import SceneHandler from "../scenes/SceneHandler";
import { EnigmaHandler } from "../display/EnigmaHandler";

class Enigma extends Item {
    private _isSolved: boolean;
    private _item: Item; // item needed to start the enigma
    private _onSuccess: () => void;

    constructor(mesh: AbstractMesh, name: string, onSuccess: () => void) {
        super(mesh, name, "Enigme : " + name.replace("enigme", ""));
        this._isSolved = false;
        this._onSuccess = onSuccess;
    }

    public get isSolved(): boolean {
        return this._isSolved;
    }

    public set isSolved(isSolved: boolean) {
        this._isSolved = isSolved;
    }

    public get item(): Item {
        return this._item;
    }

    public set item(item: Item) {
        this._item = item;
    }

    public get onSuccess(): () => void {
        return this._onSuccess;
    }

    public onFailure() { }

    public use(mesh?: Item): boolean {
        let ret = false;
        if (!this._item || this._item.equals(mesh)) {
            if (this._item) {
                ret = true;
                this._item = undefined;
            }
            SceneHandler.instance.currentScene.getEngine().exitPointerlock();
            EnigmaHandler.instance.showEnigma(this);
        } else {
            this.onFailure();
        }

        return ret;
    }
}

export default Enigma;