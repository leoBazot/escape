import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import Door from "./Door";
import Enigma from "./Enigma";
import Item from "./Item";
import Key from "./Key";
import PickableItem from "./PickableItem";

const creator = new Map<string, (name: string) => Item>;

creator.set("porte*", (name: string) => {
    return new Door(name);
});
creator.set("clef*", (name: string) => {
    return new Key(name);
});
creator.set("pickable*", (name: string) => {
    return new PickableItem(name);
});
creator.set("enigme*", (name: string) => {
    return new Enigma(name);
});

const database = new Map<string, Item>();

function createItem(mesh: AbstractMesh): Item {
    for (const [key, func] of creator.entries()) {
        if (mesh.name.match(key)) {
            return func(mesh.name);
        }
    }
    return undefined; // accessed on mesh wich can't be interacted with
}

function createDatabase(meshes: AbstractMesh[]): void {
    for (const mesh of meshes) {
        const item = createItem(mesh);
        if (item) {
            database.set(mesh.name, item);
        }
    }
}

function getItemByName(name: string): Item {
    return database.get(name);
}

function setKeyToDoor(keys: Key[]) {
    for (const key of keys) {
        const door = database.get(key.name.replace("clef", "porte"));
        if (door) {
            key.door = door as Door;
            (door as Door).key = key;
        }
    }
}

export { createDatabase, getItemByName };