import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { Button } from "@babylonjs/gui/2D/controls/button";

import Enigma from "../models/Enigma";
import SceneHandler from "../scenes/SceneHandler";
import DialogHandler from "./DialogHandler";
import Dialog from "./Dialog";
import { getItemByName } from "../models/ModelFactory";

class EnigmaDisplay {
    private _question: string;
    private _props: string[];
    private _answer: number;

    constructor(question: string, props: string[], answer: number) {
        this._question = question;
        this._props = props;
        this._answer = answer;
    }

    public get question(): string {
        return this._question;
    }

    public get props(): string[] {
        return this._props;
    }

    public checkAnswer(answer: number): boolean {
        return answer === this._answer;
    }

}

const questionDB: Map<string, EnigmaDisplay[]> = new Map<string, EnigmaDisplay[]>();

// questionDB.set('test', [new EnigmaDisplay("Question", ["bad1", "good2", "bad3"], 2)]);

// TODO finish connection to this
// Q1 = https://www.edf.fr/groupe-edf/espaces-dedies/l-energie-de-a-a-z/tout-sur-l-energie/l-electricite-au-quotidien/la-consommation-d-electricite-en-chiffres
questionDB.set("enigmeporteArmoire", [new EnigmaDisplay("Quel était la part de consomation d'electricité des entreprises françaises en 2019 ? ", ["27%", "44%", "64%"], 1)
    // Q2 = https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-de-lenergie-edition-2022-0
    , new EnigmaDisplay("Quel étais la proportion d'énergie renouvelable produite en france en 2021", ["13%", "18%", "24%"], 3)
    // Q3 = https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-des-energies-renouvelables-edition-2021
    , new EnigmaDisplay("Quel étais la part d'énergie renouvelable dans la consomation d'énergie en france en 2021 ?", ["18,7%", "19,1%", "33%"], 2)]);

class EnigmaHandler {
    private _isSolved: boolean;
    private _enigmaDisplay: EnigmaDisplay;
    private _texture: AdvancedDynamicTexture;
    private _enigma: Enigma;

    private static _instance;

    private constructor() {
        this._isSolved = false;
    }

    public static get instance(): EnigmaHandler {
        return this._instance || new this();
    }

    public set enigma(enigma: EnigmaDisplay) {
        this._enigmaDisplay = enigma;
    }

    public showEnigma(enigma: Enigma): void {
        this._enigma = enigma;
        const enigmaDisplays: EnigmaDisplay[] = questionDB.get(enigma.name);

        if (enigmaDisplays) {
            const rand: number = Math.floor(Math.random() * enigmaDisplays.length);
            this._enigmaDisplay = enigmaDisplays[rand];
            this.show();
        }
    }

    public show(): void {
        this._texture = AdvancedDynamicTexture.CreateFullscreenUI("DialogUI");

        const background = new Rectangle("QuestionBackground");

        background.background = "rgba(230, 230, 230, 0.8)"
        background.color = "black";
        background.width = 0.6;
        background.height = 0.6;
        background.cornerRadius = 10;

        const question = new TextBlock("question", this._enigmaDisplay?.question);

        question.color = "black";
        question.fontSize = 25;
        question.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
        question.fontStyle = "bold";
        question.paddingTop = 30;
        question.textWrapping = true;

        const props = new StackPanel("props");

        props.width = 0.7;
        props.height = 0.6;
        props.paddingTop = 30;
        props.spacing = 30;

        for (let i = 0; i < this._enigmaDisplay?.props.length; i++) {
            const prop = Button.CreateSimpleButton("prop_" + this._enigmaDisplay.props[i], this._enigmaDisplay.props[i]);

            prop.color = "black";
            prop.fontSize = 20;
            prop.width = 0.8;
            prop.height = "50px";
            prop.cornerRadius = 5;

            prop.onPointerUpObservable.add(() => {
                const ans = this._enigmaDisplay.checkAnswer(i + 1);
                this._isSolved = ans;
                if (ans) {
                    this._onSucces();
                }
                this.DisplayAnswer();
            });

            props.addControl(prop);
        }

        this._texture.addControl(background);
        background.addControl(question);
        background.addControl(props);
    }

    public DisplayAnswer(): void {
        this.dispose();

        this._texture = AdvancedDynamicTexture.CreateFullscreenUI("DialogUI");

        const ans = this._isSolved ? "Bonne réponse !" : "Mauvaise réponse !";

        const background = new Rectangle("AnswerBackground");

        background.background = this._isSolved ? "rgba(100, 255, 100, 0.9)" : "rgba(255, 100, 100, 0.9)";
        background.color = "black";
        background.width = 0.6;
        background.height = 0.6;
        background.cornerRadius = 10;

        const answer = new TextBlock("answer", ans);

        answer.color = "black";
        answer.fontSize = 25;
        answer.fontStyle = "bold";

        this._texture.addControl(background);
        background.addControl(answer);

        setTimeout(() => {
            this.dispose();
            this._isSolved = false;
        }, 2000);
    }

    private _onSucces(): void {
        this._enigma.onSuccess();
        SceneHandler.instance.currentScene.getEngine().enterPointerlock();
    }

    public dispose(): void {
        this._texture?.dispose();
    }
}



export { EnigmaHandler, EnigmaDisplay };