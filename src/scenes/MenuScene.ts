import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import "@babylonjs/core/Loading/loadingScreen"

import SceneHandler from "./SceneHandler";
import OfficeScene from "./OfficeScene";

async function createMenuScene(engine: Engine): Promise<void> {
    // engine.displayLoadingUI();

    // create the start scene
    let scene = new Scene(engine);
    // background color (values between 0 and 1) (r, g, b, opacity)
    scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

    let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Zero());

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const startBtn = Button.CreateSimpleButton("start", "Jouer");
    const logo = new Image("logo", "images/logo.png");

    logo.width = 0.5;
    logo.height = 0.5;
    logo.stretch = Image.STRETCH_UNIFORM;
    logo.top = "-15%";

    // css button style
    startBtn.width = 0.1;
    startBtn.height = 0.05;
    startBtn.color = "rgb(190, 190, 190)";
    startBtn.background = "rgb(15, 15, 15)";
    startBtn.thickness = 2;
    startBtn.cornerRadius = 5;
    startBtn.fontSize = 25;
    startBtn.top = "17%";

    guiMenu.addControl(logo);

    guiMenu.addControl(startBtn);

    startBtn.pointerEnterAnimation = () => {
        startBtn.background = "rgb(30, 30, 30)";
    }

    startBtn.pointerOutAnimation = () => {
        startBtn.background = "rgb(15, 15, 15)";
    }

    // this handles interactions with the start button attached to the scene
    startBtn.onPointerDownObservable.add(() => {
        new OfficeScene().createScene(engine);
    });

    await scene.whenReadyAsync();

    SceneHandler.instance.currentScene?.dispose();

    SceneHandler.instance.currentScene = scene;

    // engine.hideLoadingUI();
}

export default createMenuScene;