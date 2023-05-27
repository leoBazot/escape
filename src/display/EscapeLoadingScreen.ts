import { ILoadingScreen } from "@babylonjs/core/Loading/loadingScreen";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";

class EscapeLoadingScreen implements ILoadingScreen {
    private _texture: AdvancedDynamicTexture;

    private static loadingScreenDiv = window.document.getElementById("loadingScreen");
    //optional, but needed due to interface definitions
    public loadingUIBackgroundColor: string
    public loadingUIText: string

    constructor() { }

    public displayLoadingUI() {
        EscapeLoadingScreen.loadingScreenDiv.style.display = "flex";
    }

    public hideLoadingUI() {
        EscapeLoadingScreen.loadingScreenDiv.style.display = "none";
    }
}

export { EscapeLoadingScreen };