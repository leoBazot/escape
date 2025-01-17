import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Matrix, Vector3 } from "@babylonjs/core/Maths/math";
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
import DialogHandler, { doorOpenDefaultDialog } from "../display/DialogHandler";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import Enigma from "../models/Enigma";
import { EscapeLoadingScreen } from "../display/EscapeLoadingScreen";
import LightHandler from "../display/LightHandler";

class OfficeScene {

    private _player: Player;
    private _invetoryDisplay: AdvancedDynamicTexture;
    private _crosshair;

    constructor() {
        this._player = new Player("Monkey", 6);
    }


    public async createScene(engine: Engine) {
        SceneHandler.instance.currentScene.detachControl();

        SceneHandler.instance.currentScene.dispose();

        engine.loadingScreen = new EscapeLoadingScreen();

        engine.displayLoadingUI();

        let scene = new Scene(engine);

        LightHandler.setInstance(scene);

        scene.enablePhysics();

        this.CreateEnvironment(scene);

        engine.enterPointerlock();

        const camera = this.CreateCamera(scene);

        this.CreateRay(scene, camera);

        this.createInventory();

        scene.onPointerDown = (evt) => {
            // right click
            if (evt.button === 2) {
                if (!engine.isPointerLock) {
                    engine.enterPointerlock();
                }
            }
        };

        this.createText(scene);

        await scene.whenReadyAsync();

        scene.getEngine().hideLoadingUI();

        doorOpenDefaultDialog();

        SceneHandler.instance.currentScene = scene;
    }

    async CreateEnvironment(scene: Scene): Promise<void> {
        const salleTravail = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "salleTravail.glb",
            scene
        );

        createDatabase(salleTravail.meshes);

        const sallePause = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "sallePause.glb",
            scene
        );

        createDatabase(sallePause.meshes);

        const boss = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "boss.glb",
            scene
        );

        createDatabase(boss.meshes);

        const corridor = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "corridor.glb",
            scene
        );

        createDatabase(corridor.meshes);

        const reuBalais = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "reuBalais.glb",
            scene
        );

        createDatabase(reuBalais.meshes);

        const serveur = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "serveur.glb",
            scene
        );

        createDatabase(serveur.meshes);

        const toilettes = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "toilettes.glb",
            scene
        );

        createDatabase(toilettes.meshes);

        const steveDodo = await SceneLoader.ImportMeshAsync(
            "",
            "./models/characters/",
            "steve.glb",
            scene
        );

        createDatabase(steveDodo.meshes);

        const steveBalais = await SceneLoader.ImportMeshAsync(
            "",
            "./models/characters/",
            "steveBalais.glb",
            scene
        );

        createDatabase(steveBalais.meshes);

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

        // remove default key bindings
        camera.keysUp = [];
        camera.keysLeft = [];
        camera.keysDown = [];
        camera.keysRight = [];
        camera.keysUpward = [];
        camera.keysDownward = [];

        // zqsd
        camera.keysUpward.push(90);
        camera.keysUp.push(90);
        camera.keysLeft.push(81);
        camera.keysDownward.push(83);
        camera.keysDown.push(83);
        camera.keysRight.push(68);

        // arrow keys
        camera.keysUpward.push(38);
        camera.keysUp.push(38);
        camera.keysLeft.push(37);
        camera.keysDownward.push(40);
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
        this._crosshair = reticule
    }

    CreateRay(scene: Scene, camera: FreeCamera): void {

        let highlight = new HighlightLayer("highlight", scene);

        highlight.addExcludedMesh(this._crosshair);

        let highlightFunc = () => {
            // get screen center position
            var x = window.innerWidth / 2;
            var y = window.innerHeight / 2;

            const ray = scene.createPickingRay(x, y, Matrix.Identity(), camera);

            ray.length = 8;

            const result = scene.pickWithRay(ray);
            highlight.removeAllMeshes();
            if (result.hit) {
                let item = getItemByName(result.pickedMesh.name);

                if (item instanceof PickableItem) {
                    highlight.addMesh(item.mesh as Mesh, Color3.Green());
                } else if (item instanceof Enigma) {
                    highlight.addMesh(item.mesh as Mesh, new Color3(0.3, 0.3, 1));
                }
            }
        }

        scene.onPreKeyboardObservable.add((kbInfo) => {
            highlightFunc();
            if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                // get screen center position
                var x = window.innerWidth / 2;
                var y = window.innerHeight / 2;

                const ray = scene.createPickingRay(x, y, Matrix.Identity(), camera);

                ray.length = 8;

                // pick up item
                if (kbInfo.event.key === "e" || kbInfo.event.key === "E") {
                    const raycastHit = scene.pickWithRay(ray);

                    if (raycastHit.hit) {
                        const item = getItemByName(raycastHit.pickedMesh.name);

                        if (item) {
                            if (item instanceof PickableItem) {
                                this._player.inventory.addItem(item);
                                item.use();
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

        scene.onPointerMove = highlightFunc
    }

    public async createText(scene: Scene) {
        const fontData = await (await fetch("./fonts/Droid Sans_Regular.json")).json();

        //color
        const textColor = new StandardMaterial("textColor", scene);
        textColor.emissiveColor = Color3.White();
        textColor.alpha = 0.8;

        const texteSalleDePause = MeshBuilder.CreateText("txtSallePause", "Salle de pause", fontData, {
            size: 0.2,
            resolution: 64,
            depth: 0.1
        }, scene);

        texteSalleDePause.position = new Vector3(-7.55, 5.3, 6.7);
        texteSalleDePause.rotation = new Vector3(0, Math.PI * 3 / 2, 0);
        texteSalleDePause.material = textColor;

        const texteSalleServeur = MeshBuilder.CreateText("txtSalleServeur", "Salle serveur", fontData, {
            size: 0.2,
            resolution: 64,
            depth: 0.1
        }, scene);

        texteSalleServeur.position = new Vector3(41.12, 5.3, 11.77);
        texteSalleServeur.material = textColor;

        const texteSalleReu = MeshBuilder.CreateText("txtSalleReu", "Salle de réunion", fontData, {
            size: 0.2,
            resolution: 64,
            depth: 0.1
        }, scene);

        texteSalleReu.position = new Vector3(45.9, 5.3, 2.5);
        texteSalleReu.rotation = new Vector3(0, Math.PI, 0);
        texteSalleReu.material = textColor;

        const TexteSalleBoss = MeshBuilder.CreateText("txtSalleBoss", "Bureau du directeur", fontData, {
            size: 0.2,
            resolution: 64,
            depth: 0.1
        }, scene);

        TexteSalleBoss.position = new Vector3(51.6, 5.3, 7.2);
        TexteSalleBoss.rotation = new Vector3(0, Math.PI / 2, 0);
        TexteSalleBoss.material = textColor;

        const texteEnigmeSallePause = MeshBuilder.CreateText("txtEnigmeSallePause", "L'un des quatres est la clef !", fontData, {
            size: 0.2,
            resolution: 64,
            depth: 0.1
        }, scene);

        //color
        const enigmaTextColor = new StandardMaterial("textColor", scene);
        enigmaTextColor.diffuseColor = Color3.Black();

        texteEnigmeSallePause.position = new Vector3(51.51, 5, -6);
        texteEnigmeSallePause.rotation = new Vector3(0, Math.PI / 2, Math.PI * -0.10);
        texteEnigmeSallePause.material = enigmaTextColor;
    }
}

export default OfficeScene;