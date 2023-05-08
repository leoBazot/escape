import { AbstractMesh } from "@babylonjs/core";

abstract class Item {
    protected _mesh: AbstractMesh;
    private _name: string;
    private _description: string;


    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public equals(item: Item): boolean {
        return this._mesh === item._mesh;
    }

    public abstract use(mesh?: Item): void;
}

export default Item;