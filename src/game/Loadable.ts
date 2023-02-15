import { Scene, SceneLoader } from "@babylonjs/core";

interface Loadable {
    load(scene: Scene): void;
}

export { Loadable };