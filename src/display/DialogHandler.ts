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

export default DialogHandler;