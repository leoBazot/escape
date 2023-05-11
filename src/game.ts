import { Engine } from "@babylonjs/core/Engines/engine";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";

// import "cannon"
import "@babylonjs/loaders";
import "@babylonjs/core/Engines/WebGPU/Extensions/engine.uniformBuffer";

import { PlayerSettings, GameSettings } from "./Settings";
import { Player } from "./models/Player";
import SceneHandler from "./scenes/SceneHandler";
import createMenuScene from "./scenes/MenuScene";
import QuestionPopup from "./Question";

window.CANNON = require("cannon");

var _gameStarted = false;
var questionMenu = new QuestionPopup();
class Game {

    private _engine: Engine;
    private _canvas: HTMLCanvasElement;
    private _Psettings: PlayerSettings;
    private _Gsettings: GameSettings;
    private _player: Player;

    constructor() {
        this.start();
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

    private _initSettings() {
        this._Psettings = new PlayerSettings();
        this._Psettings.mouseSens = 0.5;
        this._Psettings.volume = 0.5;

        this._Gsettings = new GameSettings();
        this._Gsettings.fps = 30;
        this._Gsettings.mouseSens = 0.5;
        this._Gsettings.volume = 0.5;
    }

    public async start(): Promise<void> {
        var canvas = this._createCanvas();

        // Create the engine with WebGPU support if available
        const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
        if (webGPUSupported) {
            const webgpu = this._engine = new WebGPUEngine(canvas, {
                adaptToDeviceRatio: true,
                antialias: true,
            });
            await webgpu.initAsync();
            this._engine = webgpu;
        } else {
            this._engine = new Engine(canvas, true);
        }

        this._initSettings();

        await createMenuScene(this._engine);
        _gameStarted = true;

        //resize if the screen is resized/rotated
        window.addEventListener('resize', () => {
            this._engine.resize();
        });

        this._engine.runRenderLoop(() => {
            SceneHandler.instance?.currentScene.render();
        });
    }
}

// Register a key event to trigger the pop-up screen
window.addEventListener("keydown", function (event: KeyboardEvent) {
    // Check if Game State is play and if question menu is currently opened
    if (event.keyCode === 32 && !questionMenu.isMenuOpened && _gameStarted) { // Space key
        questionMenu.show("Question ?", "Réponse correcte", "Réponse incorrecte"
            , "Réponse incorrecte");
    }
});

new Game();