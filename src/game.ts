import { Engine, Scene, Vector3, Color4, FreeCamera, SceneLoader, HemisphericLight, DynamicTexture, StandardMaterial, MeshBuilder, Matrix, KeyboardEventTypes, AbstractMesh } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import "cannon"
import "@babylonjs/loaders";
import { GameState } from "./game/GameState";
import { PlayerSettings, GameSettings } from "./game/models/Settings";
import { Player } from "./game/models/Player";
import Item from "./game/models/Item";
// import salleTravailPorte from "./models/salleTravailPorte.glb";

window.CANNON = require("cannon");
class Game {

    private _engine: Engine;
    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _state: GameState;
    private _Psettings: PlayerSettings;
    private _Gsettings: GameSettings;
    private _player: Player;

    constructor() {
        var canvas = this._createCanvas();

        this._engine = new Engine(canvas, true);
        this._scene = new Scene(this._engine);
        this._state = GameState.Menu;

        this._player = new Player("Player", 10);

        this.initSettings();

        this.start();
    }

    initSettings() {
        this._Psettings = new PlayerSettings();
        this._Psettings.mouseSens = 0.5;
        this._Psettings.volume = 0.5;

        this._Gsettings = new GameSettings();
        this._Gsettings.fps = 30;
        this._Gsettings.mouseSens = 0.5;
        this._Gsettings.volume = 0.5;
    }

    // set up the canvas
    private _createCanvas(): HTMLCanvasElement {

        // Commented out for development
        document.documentElement.style["overflow"] = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        // create the canvas html element and attach it to the webpage
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);

        return this._canvas;
    }

    public async start(): Promise<void> {
        await this.goToStart();

        this._engine.runRenderLoop(() => {
            switch (this._state) {
                case GameState.Menu:
                    this._scene.render();
                    break;
                case GameState.Play:
                    this._scene.render();
                    break;
                case GameState.Enigma:
                    // Render the pause menu
                    break;
                case GameState.Pause:
                    // Render the pause menu
                    break;
                case GameState.GameOver:
                    // Render the game over screen
                    break;
            }

            //resize if the screen is resized/rotated
            window.addEventListener('resize', () => {
                this._engine.resize();
            });
        });

    }

    public async goToStart(): Promise<void> {
        //show the loading screen
        this._engine.displayLoadingUI();
        this._scene.detachControl();

        //load the start scene
        let scene = new Scene(this._engine);
        // background color (values between 0 and 1) (r, g, b, opacity)
        scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        // guiMenu();
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        // css button style
        startBtn.width = 0.2;
        startBtn.color = "white";
        startBtn.thickness = 0;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        guiMenu.addControl(startBtn);

        //this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            this._state = GameState.Play;
            this._displayGame();
        });

        await scene.whenReadyAsync();

        //hide the loading screen
        this._engine.hideLoadingUI();

        //lastly set the current state to the start state and set the scene to the start scene
        this._scene.dispose();
        this._scene = scene;
        // this.state = GameState.Menu;
    }

    private _displayGame(): void {
        let scene = new Scene(this._engine);

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        // game physics
        /* const gravity = -9.81 / this._Gsettings.fps;

        // scene.gravity = new Vector3(0, gravity, 0);
        // scene.collisionsEnabled = true;
        */
        scene.enablePhysics();

        this.CreateEnvironment(scene);

        const camera = this.CreateCamera(scene);

        this.CreateRay(scene, camera);

        //lastly set the current state to the start state and set the scene to the start scene
        this._scene.dispose();
        this._scene = scene;
        // this._state = GameState.Menu;
    }

    async CreateEnvironment(scene: Scene): Promise<void> {
        const room = await SceneLoader.ImportMeshAsync(
            "",
            "./models/rooms/",
            "salleTravailPorte.glb",
            scene
        );

        let door: AbstractMesh;

        let hinge: AbstractMesh;

        room.meshes.map((mesh) => {
            if (mesh.name.match("hinge.*")) {
                hinge = mesh;

            } else {
                mesh.checkCollisions = true;
            }
            // console.log(mesh.name, "mon pôpa c'est ", mesh.parent?.name)

            if (mesh.name.match("porte.*")) { // || mesh.parent?.name === "portePause") {
                //console.log(mesh.name, "mon pôpa c'est ", mesh.parent?.name);
                //mesh.rotate(new Vector3(0, 1, 0), Math.PI / 4, Space.WORLD);
                door = mesh;
            }


        });

        /*scene.enablePhysics();


        door.physicsImpostor = new PhysicsImpostor(door, PhysicsImpostor.BoxImpostor);

        hinge.physicsImpostor = new PhysicsImpostor(hinge, PhysicsImpostor.CylinderImpostor);

        let joint = new MotorEnabledJoint(
            PhysicsJoint.HingeJoint,
            {
                mainPivot: new Vector3(0, 0, 0),
                connectedPivot: new Vector3(0, -5, 0),
                mainAxis: new Vector3(0, 1, 0),
                connectedAxis: new Vector3(0, 1, 0),
                nativeParams: {
                }
            }
        );

        console.log(joint);

        hinge.physicsImpostor.addJoint(door.physicsImpostor, joint);

        joint.setMotor(1);
        */


        //joint.physicsJoint

        /*scene.registerBeforeRender(function () {
            hinge.rotate(Axis.Y, 0.04);
        })*/


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

        this._engine.enterPointerlock();
    }

    CreateCamera(scene: Scene): FreeCamera {
        const camera = new FreeCamera("camera", new Vector3(-2, 2, -12), scene);

        camera.attachControl();

        camera.applyGravity = true;
        camera.checkCollisions = true;

        camera.ellipsoid = new Vector3(0.5, 1.5, 0.5);

        camera.minZ = 0.50; // resolve clipping issue
        camera.speed = 0.3;
        camera.angularSensibility = 3200;

        // zqsd
        camera.keysUp.push(90);
        camera.keysLeft.push(81);
        camera.keysDown.push(83);
        camera.keysRight.push(68);

        // jump on space
        camera.keysUpward.push(32);

        this.addCrosshair(scene, camera);

        return camera;
    }

    addCrosshair(scene, camera) {
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

                    if (raycastHit.hit && raycastHit.pickedMesh.id === "chaise") {
                        console.log(raycastHit.pickedMesh.id, "ajouté à l'inventaire !");
                        this._player.inventory.addItem(new Item(raycastHit.pickedMesh.id, "", "", ""));
                        raycastHit.pickedMesh.dispose();
                    }
                }
                // open inventory
                if (kbInfo.event.key === "i") {
                    console.log(this._player.inventory.items.map((item) => item.name));
                }
            }
        });
        scene.onPointerDown = (evt) => {
            // right click
            if (evt.button === 2) {
                if (this._engine.isPointerLock) {
                    this._engine.exitPointerlock();
                } else {
                    this._engine.enterPointerlock();
                }
            }
        };
    }

}

new Game();