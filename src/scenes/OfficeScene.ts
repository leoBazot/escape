import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents";

import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/core/Collisions/collisionCoordinator";
import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Physics/Plugins/cannonJSPlugin";


import { Player } from "../models/Player";
import SceneHandler from "./SceneHandler";
import PickableItem from "../models/PickableItem";
import { createDatabase, getItemByName } from "../models/ModelFactory";


class OfficeScene {

    private _player: Player;
    // private _database: Map<string, Item>;

    constructor() {
        this._player = new Player("Monkey", 6);
    }


    public async createScene(engine: Engine) {
        SceneHandler.instance.currentScene.detachControl();

        SceneHandler.instance.currentScene.dispose();

        engine.displayLoadingUI();

        let scene = new Scene(engine);

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        scene.enablePhysics();

        this.CreateEnvironment(scene);

        engine.enterPointerlock();

        const camera = this.CreateCamera(scene);

        this.CreateRay(scene, camera);

        this.createInventory(scene);

        scene.onPointerDown = (evt) => {
            // right click
            if (evt.button === 2) {
                if (!engine.isPointerLock) {
                    engine.enterPointerlock();
                }
            }
        };

        await scene.whenReadyAsync();

        scene.getEngine().hideLoadingUI();

        SceneHandler.instance.currentScene = scene;
    }

    async CreateEnvironment(scene: Scene): Promise<void> {
        const room = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "map.glb",
            scene
        );

        createDatabase(room.meshes);



        /*room.meshes.map((mesh) => {

            console.log(mesh.name);

            if (mesh.name.match("hinge.*")) {
                hinge = mesh;
                hinge.isVisible = false;
            } else {
                mesh.checkCollisions = true;
            }

            if (mesh.name.match("porte.*")) { // || mesh.parent?.name === "portePause") {
                //console.log(mesh.name, "mon pôpa c'est ", mesh.parent?.name);
                //mesh.rotate(new Vector3(0, 1, 0), Math.PI / 4, Space.WORLD);
                door = mesh;
            }


        });*/

        /*
        const chair = await SceneLoader.ImportMeshAsync(
            "",
            "./models/furnitures/",
            "chaise.glb",
            scene,
        );

        chair.meshes.forEach((mesh) => {
            mesh.scaling = new Vector3(0.08, 0.08, 0.08);
            mesh.position = new Vector3(-2, 0, -3);
            mesh.checkCollisions = true;

            mesh.id = "chaise";
            mesh.onDispose = () => {
                chair.meshes.map((mesh) => {
                    if (!mesh.isDisposed()) {
                        mesh.dispose();
                    }
                });
            };
        });
        */
    }

    CreateCamera(scene: Scene): FreeCamera {
        const camera = new FreeCamera("camera", new Vector3(4, 3.95, -15), scene);

        camera.attachControl();

        camera.applyGravity = true;
        camera.checkCollisions = true;

        camera.ellipsoid = new Vector3(0.5, 2, 0.5);

        camera.minZ = 0.4; // resolve clipping issue
        camera.speed = 0.3;
        camera.angularSensibility = 3200;

        // zqsd
        camera.keysUp.push(90);
        camera.keysLeft.push(81);
        camera.keysDown.push(83);
        camera.keysRight.push(68);

        // arrow keys
        camera.keysUp.push(38);
        camera.keysLeft.push(37);
        camera.keysDown.push(40);
        camera.keysRight.push(39);

        // jump on space
        camera.keysUpward.push(32);

        this.addCrosshair(scene, camera);

        return camera;
    }

    createInventory(scene: Scene) {
        let w = 128

        let texture = new DynamicTexture('inventory', 0, scene, false)
        texture.hasAlpha = true
        
        let ctx = texture.getContext()

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, w, w)

        texture.update()

        let material = new StandardMaterial('inventory', scene)
        material.diffuseTexture = texture
        material.opacityTexture = texture
        material.emissiveColor.set(0, 0, 0)
        material.disableLighting = true

        let plane = MeshBuilder.CreatePlane('inventory', { size: 0.2 }, scene)
        plane.material = material
        plane.position.set(0, 0, 1.1)
        plane.isPickable = false

        let inventory = plane
        inventory.parent = scene.activeCamera

        return inventory;
    }

    addCrosshair(scene: Scene, camera: Camera) {
        let w = 128

        let texture = new DynamicTexture('reticule', w, scene, false)
        texture.hasAlpha = true

        let ctx = texture.getContext()
        let reticule

        let l = 16

        ctx.fillRect(w / 2, w / 2, l, l)
        ctx.stroke()
        ctx.beginPath()

        texture.update()

        let material = new StandardMaterial('reticule', scene)
        material.diffuseTexture = texture
        material.opacityTexture = texture
        material.emissiveColor.set(0, 0, 0)
        material.disableLighting = true

        let plane = MeshBuilder.CreatePlane('reticule', { size: 0.04 }, scene)
        plane.material = material
        plane.position.set(0, 0, 1.1)
        plane.isPickable = false

        reticule = plane
        reticule.parent = camera
        return reticule
    }

    CreateRay(scene: Scene, camera: FreeCamera): void {

        scene.onPreKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                // pick up item
                if (kbInfo.event.key === "e") {
                    const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera);

                    const raycastHit = scene.pickWithRay(ray);

                    if (raycastHit.hit) {
                        const item = getItemByName(raycastHit.pickedMesh.name);
                        if (item) {
                            // console.log(item.name, "ajouté à l'inventaire !");
                            if (item instanceof PickableItem) {
                                this._player.inventory.addItem(item);
                                raycastHit.pickedMesh.dispose();
                            } else {
                                item.use(this._player.inventory.getSelectedItem());
                            }
                        }
                    }
                    /*
                    if (raycastHit.hit && raycastHit.pickedMesh.id === "chaise") {
                        console.log(raycastHit.pickedMesh.id, "ajouté à l'inventaire !");
                        this._player.inventory.addItem(new PickableItem(raycastHit.pickedMesh.id));
                        raycastHit.pickedMesh.dispose();
                    }
                    */
                }

                // open inventory
                /*
                if (kbInfo.event.key === "i") {
                    console.log(this._player.inventory.items.map((item) => item.name));
                }
                */

                // 1 to 6 to select item
                if (kbInfo.event.key.match(/[1-6]/)) {
                    const index = parseInt(kbInfo.event.key) - 1;
                    if (this._player.inventory.items[index]) {
                        this._player.inventory.selectedItem = index;
                    }
                }
            }
        });
    }
}

export default OfficeScene;