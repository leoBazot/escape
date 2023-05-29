import {AdvancedDynamicTexture} from "@babylonjs/gui/2D/advancedDynamicTexture";
import {Rectangle} from "@babylonjs/gui/2D/controls/rectangle";
import {TextBlock} from "@babylonjs/gui/2D/controls/textBlock";
import {StackPanel} from "@babylonjs/gui/2D/controls/stackPanel";
import {Button} from "@babylonjs/gui/2D/controls/button";

import Enigma from "../models/Enigma";
import SceneHandler from "../scenes/SceneHandler";
import DialogHandler from "./DialogHandler";
import Dialog from "./Dialog";
import {getItemByName} from "../models/ModelFactory";

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
questionDB.set("enigmeporteArmoire", [new EnigmaDisplay("Quelle était la part de consommation d'électricité des entreprises françaises en 2019 ?", ["27%", "44%", "64%"], 1)
    // Q2 = https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-de-lenergie-edition-2022-0
    , new EnigmaDisplay("Quelle était la proportion d'énergie renouvelable produite en France en 2021", ["13%", "18%", "24%"], 3)
    // Q3 = https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-des-energies-renouvelables-edition-2021
    , new EnigmaDisplay("Quelle était la part d'énergie renouvelable dans la consommation d'énergie en France en 2021 ?", ["18,7%", "19,1%", "33%"], 2),
    // Q4 Réparer le panneau électrique
    , new EnigmaDisplay("Comment une entreprise peut-elle réduire sa consommation d'électricité ?", ["En installant des capteurs de présence pour réguler l'éclairage et la climatisation", "En utilisant des appareils électroniques moins économes en énergie ", "En laissant les lumières allumées dans les zones de travail non utilisées"], 1)
    // Q5 Réparer la machine à café
    , new EnigmaDisplay("Quels sont les avantages de l'utilisation de café équitable pour les entreprises au-delà de l'amélioration de leur image de marque ? ", ["Une amélioration des conditions de travail et des relations avec les fournisseurs", "Une réduction des coûts de production", "Une augmentation des ventes"], 1)
    // Q6 Déverrouiller la salle de pause
    , new EnigmaDisplay("Comment l'utilisation des salles de pause peut-elle être bénéfique pour l'environnement ?", ["En réduisant les déchets alimentaires grâce à l'utilisation de vaisselle réutilisable ", "En réduisant l'utilisation de la climatisation dans les bureaux", "En encourageant les employés à prendre les transports en commun pour aller travailler"], 1)
    // Q7 Remettre l'éelectricité en reconnectant les panneaux photovoltaïques
    , new EnigmaDisplay("Comment l'efficacité énergétique peut-elle contribuer à la RSE ? ", ["En réduisant la consommation d'énergie et donc les émissions de gaz à effet de serre ", "En augmentant la consommation d'énergie fossile pour augmenter la production ", "En augmentant les coûts de production de l'entreprise"], 1)
    // Q8 Ramasser 2 objets pour enlever la rouille
    , new EnigmaDisplay("Pourquoi l'utilisation de produits chimiques dispensables peut-elle être préjudiciable à la RSE ?", ["Parce que ces produits peuvent avoir un impact négatif sur l'environnement ", "Parce que ces produits peuvent être dangereux pour la santé des travailleurs, même dans le respect des normes établies", "Parce que ces produits peuvent être coûteux pour l'entreprise"], 1)
    // Q9 Réveiller Steve pour accéder au fumoir
    , new EnigmaDisplay("Quelles sont les conséquences possibles pour une entreprise qui ne gère pas correctement les mégots de cigarettes sur son lieu de travail ?", ["Amende pour non-respect des normes environnementales", "Perte de productivité des employés", "Réduction de la satisfaction des employés en raison de la mauvaise gestion des déchets"], 1)
    // Q10 Transformer la salle de fumoir en salle végétale
    , new EnigmaDisplay("Comment l'entreprise peut-elle impliquer les employés dans le processus de transformation de l'ancien fumoir en une autre pièce ?", ["En organisant des groupes de travail pour identifier les besoins des employés en matière de nouvelles pièces", "En ne prenant en compte que son profit", "En proposant un vote aux employés pour décider de la nouvelle pièce"], 1)]);

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
        }, 1000);
    }

    private _onSucces(): void {
        this._enigma.onSuccess();
        SceneHandler.instance.currentScene.getEngine().enterPointerlock();
    }

    public dispose(): void {
        this._texture?.dispose();
    }
}


export {EnigmaHandler, EnigmaDisplay};