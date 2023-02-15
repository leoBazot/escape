import { Scene, SceneLoader } from "babylonjs";

interface Loadable {
    load(scene: Scene): void;
}

export { Loadable };