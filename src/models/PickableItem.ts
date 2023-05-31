import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import Item from "./Item";
import Dialog from "../display/Dialog";
import DialogHandler from "../display/DialogHandler";

class PickableItem extends Item {
    private _imagePath: string;

    constructor(mesh: AbstractMesh, name: string, description?: string, imagePath?: string) {
        super(mesh, name, description);
        if (imagePath !== undefined) {
            this._imagePath = imagePath;
        } else {
            this._imagePath = "./images/pickable/" + name.replace("pickable", "") + ".png";
        }
    }

    public get image(): string {
        return this._imagePath;
    }

    public use(mesh?: Item): boolean {
        // throw new Error("PickableItem : This item can't be used !");
        return false;
    }
}

export default PickableItem;