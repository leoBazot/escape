import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";

function gamesEnd() {
    const texture = AdvancedDynamicTexture.CreateFullscreenUI("EndGameUI");

    texture.background = "black";

    const text = new TextBlock();

    text.text = "Félicitations ! Vous avez terminé le jeu !";

    text.color = "white";
}