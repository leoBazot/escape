import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";

class Dialog {
    private _talker: string;
    private _text: string;
    private _texture: AdvancedDynamicTexture;

    constructor(talker: string, text: string) {
        this._talker = talker;
        this._text = text;
    }

    public show(): void {
        this._texture = AdvancedDynamicTexture.CreateFullscreenUI("DialogUI");

        const background = new Rectangle("DialogBackground");

        background.background = "rgba(240, 240, 240, 0.5)"
        background.color = "black";
        background.width = 1;
        background.height = 0.15;
        background.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_BOTTOM;

        const talker = new TextBlock("talker", this._talker);

        talker.color = "black";
        talker.fontSize = 20;
        talker.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        talker.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
        talker.fontStyle = "bold";
        talker.paddingTop = 10;
        talker.paddingLeft = 20;

        const text = new TextBlock("text", this._text);
        text.color = "black";
        text.fontSize = 18;
        text.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        text.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
        text.paddingTop = 40;
        text.paddingLeft = 20;
        text.paddingRight = 20;
        text.textWrapping = true;

        const continuer = new TextBlock("continuer", "Appuyez sur Espace pour continuer");

        continuer.color = "black";
        continuer.fontSize = 16;
        continuer.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
        continuer.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
        continuer.paddingBottom = 10;
        continuer.paddingRight = 20;
        continuer.fontStyle = "italic";


        this._texture.addControl(background);
        background.addControl(talker);
        background.addControl(text);
        background.addControl(continuer);
    }

    public dispose(): void {
        this._texture.dispose();
    }
}

export default Dialog;