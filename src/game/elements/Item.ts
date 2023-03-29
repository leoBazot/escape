import { Vector3 } from "@babylonjs/core";

class Item {
    private _name: string;
    private _description: string;
    private _modelPath: string;
    private _texturePath: string;
    private _iconPath: string;
    private _position: Vector3;


    constructor(name: string, description: string, modelPath: string, texturePath: string, iconPath: string, position: Vector3) {
        this._name = name;
        this._description = description;
        this._modelPath = modelPath;
        this._texturePath = texturePath;
        this._iconPath = iconPath;
        this._position = position;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get model(): string {
        return this._modelPath;
    }

    public get texture(): string {
        return this._texturePath;
    }

    public get icon(): string{
        return this._iconPath;
    }

    public get position(): Vector3{
        return this._position;
    }

    public set name(name: string){
        this._name=name;
    }

    public set description(description: string){
        this._description=description;
    }

    public set model(model: string){
        this._modelPath=model;
    }


    public set texture(texture: string){
        this._texturePath=texture;
    }

    public set icon(icon: string){
        this._iconPath = icon;
    }

    public set position(position: Vector3){
        this._position=position;
    }
}

export default Item;