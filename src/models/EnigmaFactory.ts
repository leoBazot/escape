import Dialog from "../display/Dialog";
import DialogHandler from "../display/DialogHandler";

// fonction pour les enigmes en cours de création
let wip = () => {
    console.log("Work In Progress : This enigma isn't done yet !");
};

// fonction non utilisée et présente uniquement pour l'exemple (ne pas supprimer)
let dialogExample = () => {
    // Créer les dialogues
    let d1 = new Dialog("Personnage 1", "Bonjour, je suis un exemple de dialogue !");
    let d2 = new Dialog("Personnage 2", "Bonjour, je un 2 eme message à ajouter au dialogue !");

    // Ajouter les dialogues dans l'ordre d'affichage
    DialogHandler.instance.addDialog(d1);
    DialogHandler.instance.addDialog(d2);

    // Afficher le premier dialogue
    DialogHandler.instance.showNextDialog();

    // les dialogues suivants s'afficheront automatiquement quand l'utilisateur appuyras sur la touche espace
}

let resolver: Map<string, () => void> = new Map<string, () => void>();

// TODO changer la fonction de résolution pou rallumer les lumières
resolver.set("enigmeporteArmoire", dialogExample);

function getResolver(name: string): () => void {
    return resolver.get(name) || wip;
}

export { getResolver };