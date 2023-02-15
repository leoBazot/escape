class Item {
    private _name: string;
    private _description: string;
    private _imagePath: string;


    constructor(name: string, description: string, imagePath: string) {
        this._name = name;
        this._description = description;
        this._imagePath = imagePath;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get image(): string {
        return this._imagePath;
    }
}