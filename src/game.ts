import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene } from "@babylonjs/core";
import { guiMenu } from "./menu";

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
        let scene = await guiMenu(this._engine);

        //hide the loading screen
        this._engine.hideLoadingUI();

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