import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

import Door from "./Door";
import Enigma from "./Enigma";
import Item from "./Item";
import Key from "./Key";
import PickableItem from "./PickableItem";
import { getResolver } from "./EnigmaFactory";
import LightHandler from "../display/LightHandler";
import DialogHandler, { noItemEnigmeSteve } from "../display/DialogHandler";
import Dialog from "../display/Dialog";

const creator = new Map<string, (mesh: AbstractMesh) => Item>;

const database = new Map<string, Item>();

function createItem(mesh: AbstractMesh): Item {
    mesh.checkCollisions = true;
    for (const [key, func] of creator.entries()) {
        if (mesh.name.match(key)) {
            return func(mesh);
        }
    }
    return undefined; // accessed on mesh wich can't be interacted with (ex: floor, walls, etc.)
}

function createDatabase(meshes: AbstractMesh[]): void {
    for (const mesh of meshes) {
        const item = createItem(mesh);
        if (item) {
            database.set(mesh.name, item);
        }
    }
}

function setKeystoDoors(): void {
    for (const item of database.values()) {
        if (item instanceof Key) {
            setKeyToDoor(item);
        }
    }
}

function postCreation(): void {
    database.get("pickableCafePause_primitive1").mesh.parent = database.get("pickableCafePause_primitive0")?.mesh;
    database.delete("pickableCafePause_primitive2");
    database.delete("pickableCafePause_primitive3");

    LightHandler.instance.lightsOff();

    database.get("badgePause").use = () => {
        let badge = new Dialog("Vous", "Tiens quelqu'un a dû oublier ça. \n Je comprends pas pourquoi j'en ais toujours pas mais je devrai pouvoir me promener un peu plus");

        DialogHandler.instance.addDialog(badge);
        DialogHandler.instance.showNextDialog();

        return false;
    }

    const steve = database.get("enigmeSteve") as Enigma;
    steve.item = database.get("pickableCafePause_primitive0");
    steve.onFailure = noItemEnigmeSteve;
}

function getItemByName(name: string): Item {
    return database.get(name);
}

function setKeyToDoor(key: Key) {
    const door = database.get(key.name.replace("badge", "porte"));
    if (door) {
        key.door = door as Door;
        (door as Door).key = key;
    }
}

function _onSuccesCreator(id: string, onSucces: () => void): () => void {
    return () => {
        onSucces();
        database.delete(id);
    };
}

creator.set("\^porte*", (mesh: AbstractMesh) => {
    return new Door(mesh, mesh.name);
});
creator.set("\^badge*", (mesh: AbstractMesh) => {
    return new Key(mesh, mesh.name);
});
creator.set("\^pickable*", (mesh: AbstractMesh) => {
    return new PickableItem(mesh, mesh.name);
});
creator.set("\^enigme*", (mesh: AbstractMesh) => {
    return new Enigma(mesh, mesh.name, _onSuccesCreator(mesh.name, getResolver(mesh.name)));
});
creator.set("\^hinge*", (mesh: AbstractMesh) => {
    mesh.isVisible = false;
    mesh.checkCollisions = false;
    return undefined;
});
creator.set("\^lumiere*", (mesh: AbstractMesh) => {
    LightHandler.instance.addLightMesh(mesh);
    return undefined;
});

export { createDatabase, getItemByName, setKeystoDoors, postCreation };