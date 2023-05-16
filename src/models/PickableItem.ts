import Item from "./Item";

class PickableItem extends Item {
    private _imagePath: string;

    constructor(name: string, description?: string, imagePath?: string) {
        super(name, description);
        if (imagePath !== undefined) {
            this._imagePath = imagePath;
        } else {
            this._imagePath = "./images/" + name.replace("pickable", "") + ".png";
        }
    }

    public get image(): string {
        return this._imagePath;
    }

    public use(mesh?: Item): void {
        throw new Error("PickableItem : This item can't be used !");
    }
}

export default PickableItem;