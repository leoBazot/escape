import Dialog from "../display/Dialog";
import DialogHandler from "../display/DialogHandler";
import LightHandler from "../display/LightHandler";
import Door from "./Door";
import { getItemByName } from "./ModelFactory";

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

let enigmePanneauElec = () => {
    LightHandler.instance.lightsOn();

    let resolvElec = new Dialog("Vous", "Bizarre commme système de redémarrage mais tant que ça marche...");

    DialogHandler.instance.addDialog(resolvElec);
    DialogHandler.instance.showNextDialog();
}

let enigmeSteve = () => {
    let door = getItemByName("porteFumoir") as Door;
    door.forceOpen();

    getItemByName("enigmeSteve").mesh.dispose();

    let resolvSteve = [new Dialog("Steve", "Du café ?!! \nDonnes moi ça tout de suite! (...) Qu'est ce que ça fait du bien! \nC'est pas toujours facile de bosser 10h par jour...")
        , new Dialog("Vous", "Tu m'étonnes! Content que tu aille mieux")
        , new Dialog("Steve", "Merci, avec ça je vais pouvoir me remettre au travail.")];

    DialogHandler.instance.addDialogs(resolvSteve);

    DialogHandler.instance.showNextDialog();
}

let resolver: Map<string, () => void> = new Map<string, () => void>();

// TODO changer la fonction de résolution pou rallumer les lumières
resolver.set("enigmeArmoireElec", enigmePanneauElec);

resolver.set("enigmeSteve", enigmeSteve);

function getResolver(name: string): () => void {
    return resolver.get(name) || wip;
}

export { getResolver };