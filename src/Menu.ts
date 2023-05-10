import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { GameState } from "./GameState";

async function createMenu(engine: Engine): Promise<Scene> {
    //load the start scene
    let scene = new Scene(engine);

    // background color (values between 0 and 1) (r, g, b, opacity)
    scene.clearColor = new Color4(0.1, 0.1, 0.1, 1); // black
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

    return scene;
}

export { createMenu };