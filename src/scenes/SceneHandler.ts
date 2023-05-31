import { SceneSerializer } from "@babylonjs/core/Misc/sceneSerializer";
import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

class SceneHandler {

    private static _instance: SceneHandler;
    private _save: JSON;
    private _currentScene: Scene;

    private constructor() { }

    public static get instance(): SceneHandler {
        return this._instance || (this._instance = new this());
    }

    // getter and setter for current scene
    public get currentScene(): Scene {
        return this._currentScene;
    }

    public set currentScene(scene: Scene) {
        this._currentScene = scene;
    }


    public saveScene(): void {
        this._save = SceneSerializer.Serialize(this._currentScene);
    };

    private _onSceneLoaded(newScene: Scene): void {
        this._currentScene = newScene;

        var engine = this._currentScene.getEngine();

        var camera = this._currentScene.cameras[0];
        this._currentScene.activeCamera = camera;

        camera.attachControl();

        this._currentScene.executeWhenReady(() => {
            console.log("test");
            engine.hideLoadingUI();
        });
    }

    public loadScene(engine: Engine): void {
        var sceneString: string = "data:" + JSON.stringify(this._save);
        SceneLoader.Load("", sceneString, engine, (newScene) => {
            this._currentScene = newScene;
        });

        this._currentScene.dispose();

        var sceneString = "data:" + JSON.stringify(this._save);
        SceneLoader.Load("", sceneString, engine, this._onSceneLoaded);
    }

}

export default SceneHandler;