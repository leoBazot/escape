import Dialog from "./Dialog";

class DialogHandler {

    private _currentDialog: Dialog = undefined;
    private _dialogs: Dialog[];
    private static _instance: DialogHandler;

    private constructor() {
        this._dialogs = [];
    }

    public static get instance(): DialogHandler {
        return DialogHandler._instance || (DialogHandler._instance = new this());
    }

    public addDialog(dialog: Dialog): void {
        this._dialogs.push(dialog);
    }

    public addDialogs(dialogs: Dialog[]): void {
        dialogs.forEach((d) => {
            this._dialogs.push(d);
        });
    }

    public showNextDialog(): void {
        if (this._dialogs.length > 0) {
            this._dialogs[0]?.show();
            this._currentDialog?.dispose();
            this._currentDialog = this._dialogs[0];
            this._dialogs.shift();
        } else {
            this._currentDialog?.dispose();
            this._currentDialog = undefined;
        }
    }
}

function doorClosedDefaultDialog(): void {
    let porteKeblo = [new Dialog("Vous", "C'est bloqué !")
        , new Dialog("Vous", "Je vais pas pouvoir aller là pour l'instant...")
        , new Dialog("Vous", "Il me semble qu'il me faut un badge pour ouvrir cette porte.")
        , new Dialog("Vous", "Je sais encore ouvrir une porte ! Celle là est verrouillée c'est sûr")];

    const rand: number = Math.floor(Math.random() * porteKeblo.length);

    DialogHandler.instance.addDialog(porteKeblo[rand]);
    DialogHandler.instance.showNextDialog();
}

function doorOpenDefaultDialog(): void {
    let intro1 = new Dialog("Vous", "Je me suis endormi? \nTout le monde est parti visiblement, je devrai trouver la sortie moi aussi...");
    let intro2 = new Dialog("Vous", "On y voit pas grand chose, je devrai essayer de rallumer la lumière, l'électricité a encore dû sauter.");

    DialogHandler.instance.addDialog(intro1);
    DialogHandler.instance.addDialog(intro2);

    DialogHandler.instance.showNextDialog();
}

let noItemEnigmeSteve = () => {
    let dialogueSteve = [new Dialog("Vous", "(Mais c'est Steve, qu'est ce qu'il fait là)")
        , new Dialog("Vous", "Steve, tu m'entends, ça va?")
        , new Dialog("Steve", "Gnn hmm?")
        , new Dialog("Steve", "caaaféééé... rrrRRRrrr pcchh")
        , new Dialog("Vous", "Tu m'étonnes ! Je vais voir si je te trouve ça")];

    DialogHandler.instance.addDialogs(dialogueSteve);
    DialogHandler.instance.showNextDialog();
}

export default DialogHandler;
export { doorClosedDefaultDialog, doorOpenDefaultDialog, noItemEnigmeSteve };