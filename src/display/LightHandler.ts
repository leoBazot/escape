import { StandardMaterial } from "@babylonjs/core";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Scene } from "@babylonjs/core/scene";

class LightHandler {
    private _lightMaterial: StandardMaterial;
    private _light: HemisphericLight;

    private _lightMeshes: AbstractMesh[] = [];

    private static _instance: LightHandler;

    private constructor(scene: Scene) {
        this._light = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        this._lightMaterial = new StandardMaterial("lightEmissiveColor", scene);
        this._lightMaterial.emissiveColor = Color3.White();
    }

    public static get instance(): LightHandler {
        return LightHandler._instance;
    }

    public static setInstance(scene: Scene): void {
        LightHandler._instance = new this(scene);
    }

    public addLightMesh(mesh: AbstractMesh): void {
        this._lightMeshes.push(mesh);
    }

    public lightsOn(): void {
        this._light.intensity = 1;
        this._lightMeshes.forEach((mesh) => {
            mesh.material = this._lightMaterial;
        });
    }

    public lightsOff(): void {
        this._light.intensity = 0.2;
        this._lightMeshes.forEach((mesh) => {
            mesh.material = null;
        });
    }

}

export default LightHandler;