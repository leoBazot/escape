import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import Door from "./Door";
import Enigma from "./Enigma";
import Item from "./Item";
import Key from "./Key";
import PickableItem from "./PickableItem";

const creator = new Map<string, (mesh: AbstractMesh) => Item>;

creator.set("porte*", (mesh: AbstractMesh) => {
    return new Door(mesh.name);
});
creator.set("clef*", (mesh: AbstractMesh) => {
    return new Key(mesh.name);
});
creator.set("pickable*", (mesh: AbstractMesh) => {
    return new PickableItem(mesh.name);
});
creator.set("enigme*", (mesh: AbstractMesh) => {
    return new Enigma(mesh.name);
});
creator.set("hinge*", (mesh: AbstractMesh) => {
    mesh.isVisible = false;
    mesh.checkCollisions = false;
    return undefined;
});

const database = new Map<string, Item>();

function createItem(mesh: AbstractMesh): Item {
    mesh.checkCollisions = true;
    for (const [key, func] of creator.entries()) {
        if (mesh.name.match(key)) {
            return func(mesh);
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