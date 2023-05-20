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
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";

import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/core/Collisions/collisionCoordinator";
import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Physics/Plugins/cannonJSPlugin";
import "@babylonjs/core/Animations/animatable";


import { Player } from "../models/Player";
import SceneHandler from "./SceneHandler";
import PickableItem from "../models/PickableItem";
import { createDatabase, getItemByName, postCreation, setKeystoDoors } from "../models/ModelFactory";
import DialogHandler from "../display/DialogHandler";
import Dialog from "../display/Dialog";


class OfficeScene {

    private _player: Player;
    private _invetoryDisplay: AdvancedDynamicTexture;

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

        this.createInventory();

        let d = new Dialog("test", "Je suis un super texte à peine long mais vraiment pas trop quoi, juste ce qu'il faut. Mon but ? Permetre de tester la gestion des retour à la ligne car si se problème n'est pas automatiquement résolu par babylonjs mon envie de vivre en sera considérablement réduite. Ce qui serait domage non, personne n'a envie que je sois triste ? ... pitiez répondezzzzz moiiiiiiiii ! (promis je ne suis pas trop fou)");

        DialogHandler.instance.addDialog(d);

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
        const salleTravail = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "salleTravail.glb",
            scene
        );

        const sallePause = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "sallePause.glb",
            scene
        );

        const boss = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "boss.glb",
            scene
        );

        const corridor = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "corridor.glb",
            scene
        );

        const reuBalais = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "reuBalais.glb",
            scene
        );

        const serveur = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "serveur.glb",
            scene
        );

        const toilettes = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "toilettes.glb",
            scene
        );

        createDatabase(salleTravail.meshes);

        createDatabase(sallePause.meshes);

        createDatabase(boss.meshes);

        createDatabase(corridor.meshes);

        createDatabase(reuBalais.meshes);

        createDatabase(serveur.meshes);

        createDatabase(toilettes.meshes);

        setKeystoDoors();

        postCreation();
    }

    CreateCamera(scene: Scene): FreeCamera {
        const camera = new FreeCamera("camera", new Vector3(4, 3.95, -15), scene);

        camera.attachControl();

        camera.applyGravity = true;
        camera.checkCollisions = true;

        camera.ellipsoid = new Vector3(0.5, 2, 0.5);

        camera.minZ = 0.2; // resolve clipping issue
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

    createInventory() {
        this._invetoryDisplay?.dispose();

        const inventory = AdvancedDynamicTexture.CreateFullscreenUI("InventoryUI");

        const inventoryPanel = new StackPanel();

        inventoryPanel.width = "80px";
        inventoryPanel.left = "40%";
        inventoryPanel.top = "-7%";
        inventoryPanel.spacing = 20;

        for (let i = 0; i < 6; i++) {

            const container = new Rectangle("container" + i);
            container.width = "80px";
            container.height = "80px";
            container.background = "rgba(240, 240, 240, 0.5)"
            if (i === this._player.inventory.selectedItem) {
                container.thickness = 5;
                container.color = "white"
            } else {
                container.color = "black";
                container.thickness = 4;
            }
            container.cornerRadius = 10;

            const item = new Image("item" + i, this._player.inventory.getItem(i)?.image);

            item.stretch = Image.STRETCH_FILL;
            item.color = "black";
            item.width = "100%";
            item.height = "100%";

            container.addControl(item);
            inventoryPanel.addControl(container);
        }

        inventory.addControl(inventoryPanel);

        this._invetoryDisplay = inventory;
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
                if (kbInfo.event.key === "e" || kbInfo.event.key === "E") {
                    // get screen center position
                    var x = window.innerWidth / 2;
                    var y = window.innerHeight / 2;

                    const ray = scene.createPickingRay(x, y, Matrix.Identity(), camera);

                    const raycastHit = scene.pickWithRay(ray);

                    if (raycastHit.hit) {
                        raycastHit.pickedMesh.dispose();
                        console.log(raycastHit.pickedMesh.name);
                        const item = getItemByName(raycastHit.pickedMesh.name);
                        console.log(item?.mesh);
                        if (item) {
                            if (item instanceof PickableItem) {
                                this._player.inventory.addItem(item);
                                raycastHit.pickedMesh.dispose();
                                this.createInventory();
                            } else {
                                if (item.use(this._player.inventory.getSelectedItem())) {
                                    this._player.inventory.removeItem(this._player.inventory.selectedItem);
                                    this.createInventory();
                                }
                            }
                        }
                    }
                }

                // 1 to 6 to select item
                if (kbInfo.event.key.match(/[1-6]/)) {
                    const index = parseInt(kbInfo.event.key) - 1;
                    if (0 <= index && index < this._player.inventory.capacity) {
                        this._player.inventory.selectedItem = index;
                        this.createInventory();
                    }
                }

                // space to next dialog
                if (kbInfo.event.key === " ") {
                    DialogHandler.instance.showNextDialog();
                }
            }
        });
    }
}

export default OfficeScene;