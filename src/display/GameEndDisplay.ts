import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";

function gamesEnd() {
    const texture = AdvancedDynamicTexture.CreateFullscreenUI("EndGameUI");

    texture.background = "black";

    const felicText = new TextBlock();

    felicText.text = "Bravo!! vous avez réussi à améliorer l’entreprise!!\n";
    felicText.fontSize = 25;
    felicText.color = "white";
    felicText.fontStyle = "bold";
    felicText.paddingBottom = 70;


    const text = new TextBlock();

    text.text = "Grâce à vos connaissances en RSE vous avez réussi à sortir !\nChaque énigmes que vous avez élucidé, vous en a appris plus sur la RSE, le bien-être des employés, l’utilisation d’énergies renouvelables, sur les produits équitables (comme le café)\nPS : N’hésitez pas à faire une nouvelle partie, vous aurez peut-être de nouvelles questions et vous pourrez apprendre de nouvelles choses …";
    text.color = "white";

    texture.addControl(felicText);
    texture.addControl(text);
}

export default gamesEnd;