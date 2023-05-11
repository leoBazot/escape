import * as GUI from "@babylonjs/gui";

class QuestionPopup {
    private _questionText: string;
    private _correctAnswer: string;
    private _incorrectAnswer1: string;
    private _incorrectAnswer2: string;
    private _isMenuOpened: boolean;

    constructor() {
        this._isMenuOpened = false;
    }


    get isMenuOpened(): boolean {
        return this._isMenuOpened;
    }

    public show(questionText: string, correctAnswer: string, incorrectAnswer1: string, incorrectAnswer2: string): void {
        this._questionText = questionText;
        this._correctAnswer = correctAnswer;
        this._incorrectAnswer1 = incorrectAnswer1;
        this._incorrectAnswer2 = incorrectAnswer2;
        this._isMenuOpened = true;
        let buttonPositions = ['-25%', '0%', '25%']
        // Set the button positions randomly
        buttonPositions.sort(() => Math.random() - 0.5);

        // Create a GUI
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

        // Create a container for the pop-up screen
        const container = new GUI.Container();
        container.background = 'rgba(0, 115, 40, 0.8)';
        container.width = '75%';
        container.height = '50%';
        container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        // Add a label for the question
        const questionLabel = new GUI.TextBlock();
        questionLabel.text = this._questionText;
        questionLabel.color = 'white';
        questionLabel.fontSize = '24px';
        questionLabel.paddingBottom = '10px';
        questionLabel.top = '-20%';
        container.addControl(questionLabel);

        // Add buttons for the possible answers
        const correctAnswerButton = GUI.Button.CreateSimpleButton('answerButton1', this._correctAnswer);
        correctAnswerButton.width = '200px';
        correctAnswerButton.height = '50px';
        correctAnswerButton.color = 'white';
        correctAnswerButton.background = 'green';
        correctAnswerButton.left = buttonPositions[0];
        correctAnswerButton.onPointerUpObservable.add(() => {
            incorrectAnswerButton1.background = 'red';
            incorrectAnswerButton2.background = 'red';
            // Perform actions for correct answer
            setTimeout(() => {
                container.dispose();
                this._isMenuOpened = false;
            }, 2000);

        });
        container.addControl(correctAnswerButton);

        const incorrectAnswerButton1 = GUI.Button.CreateSimpleButton('answerButton2', this._incorrectAnswer1);
        incorrectAnswerButton1.width = '200px';
        incorrectAnswerButton1.height = '50px';
        incorrectAnswerButton1.color = 'white';
        incorrectAnswerButton1.background = 'green';
        incorrectAnswerButton1.left = buttonPositions[1]
        incorrectAnswerButton1.onPointerUpObservable.add(() => {
            incorrectAnswerButton1.background = 'red';
            incorrectAnswerButton2.background = 'red';
            // Perform actions for incorrect answer
            setTimeout(() => {
                container.dispose();
                this._isMenuOpened = false;
            }, 2000);
            this._isMenuOpened = false;

        });
        container.addControl(incorrectAnswerButton1);

        const incorrectAnswerButton2 = GUI.Button.CreateSimpleButton('answerButton3', this._incorrectAnswer2);
        incorrectAnswerButton2.width = '200px';
        incorrectAnswerButton2.height = '50px';
        incorrectAnswerButton2.color = 'white';
        incorrectAnswerButton2.background = 'green';
        incorrectAnswerButton2.left = buttonPositions[2]
        incorrectAnswerButton2.onPointerUpObservable.add(() => {
            incorrectAnswerButton1.background = 'red';
            incorrectAnswerButton2.background = 'red';
            // Perform actions for incorrect answer
            setTimeout(() => {
                container.dispose();
                this._isMenuOpened = false;
            }, 2000);
            this._isMenuOpened = false;

        });
        container.addControl(incorrectAnswerButton2)

        const closeButton = GUI.Button.CreateSimpleButton('closeButton', 'Close');
        closeButton.width = '200px';
        closeButton.height = '50px';
        closeButton.color = 'white';
        closeButton.background = 'gray';
        closeButton.left = '75%'
        closeButton.top = '75%'
        closeButton.onPointerUpObservable.add(() => {
            // Perform actions for incorrect answer
            container.dispose();
            this._isMenuOpened = false;
        });
        container.addControl(incorrectAnswerButton2);

        // Add the container to the GUI
        advancedTexture.addControl(container);
    }
}

export default QuestionPopup;
