import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import { Engine, Scene, Vector3, Color4, FreeCamera } from "@babylonjs/core";

async function guiMenu(engine): Promise<Scene> {

    let scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Zero());

    // guiMenu();
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const startBtn = Button.CreateSimpleButton("start", "PLAY");
    startBtn.width = 0.2;
    startBtn.height = "50%";
    startBtn.color = "white";
    startBtn.top = "-14px";
    startBtn.thickness = 0;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(startBtn);

    //this handles interactions with the start button attached to the scene
    startBtn.onPointerDownObservable.add(() => {
        console.log("start button clicked");
    });

    await scene.whenReadyAsync();

    return scene;
}


export { guiMenu };