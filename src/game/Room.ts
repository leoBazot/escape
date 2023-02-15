import { Scene } from "babylonjs";
import { Loadable } from "./Loadable";

class Room implements Loadable {

    private _path: string;

    constructor(path: string) {
        this._path = path;
    }

    public load(scene: Scene): void {
        // TODO: Load the room
    }
}

export { Room };