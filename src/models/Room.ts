class Room {

    private _path: string;
    private _green: boolean = false;

    constructor(path: string) {
        this._path = path;
    }

    get path(): string {
        return this._path;
    }

    get green(): boolean {
        return this._green;
    }

    set green(value: boolean) {
        this._green = value;
    }
}

export { Room };