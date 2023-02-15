import { Engine, Scene, Vector3, Color4, FreeCamera, SceneLoader, ArcRotateCamera, HemisphericLight } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import "@babylonjs/loaders"

enum GameState {
    Menu,
    Play,
    Enigma,
    Pause,
    GameOver
}

class Game {

    private _engine: Engine;
    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _state: GameState;

    constructor() {
        var canvas = this._createCanvas();

        this._engine = new Engine(canvas, true);
        this._scene = new Scene(this._engine);
        this._state = GameState.Menu;

        this.start();
    }

    //set up the canvas
    private _createCanvas(): HTMLCanvasElement {

        //Commented out for development
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

        //create the canvas html element and attach it to the webpage
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
                    // Update the game state
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
            console.log("start button clicked");
            this.setState(GameState.Play);
            this._displayGame();
        });

        // SceneLoader.ImportMesh("", "./models/rooms/", "salle_travail.glb", scene, (meshes) => {
        //     console.log("meshes", meshes);
        // });

        await scene.whenReadyAsync();

        //hide the loading screen
        this._engine.hideLoadingUI();

        //lastly set the current state to the start state and set the scene to the start scene
        this._scene.dispose();
        this._scene = scene;
        this.setState(GameState.Menu);
    }

    private _displayGame(): void {
        let scene = new Scene(this._engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(this._canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        SceneLoader.ImportMesh(
            "",
            "./models/rooms/",
            "salle_travail.glb",
            scene,
        );

        //lastly set the current state to the start state and set the scene to the start scene
        this._scene.dispose();
        this._scene = scene;
        this.setState(GameState.Menu);
    }

    public setState(state: GameState): void {
        this._state = state;
    }
}

new Game();