import Door from "../models/Door";

class WrongKeyError extends Error {

    private _door: Door;

    constructor(door: Door) {
        super(`Key "${door.name}" doesn't open this door`);
        this._door = door;
    }
}

function createWrongKeyError(door: Door): WrongKeyError {
    return new WrongKeyError(door);
}

export { createWrongKeyError, WrongKeyError };