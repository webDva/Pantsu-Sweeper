/*
 * Template
 */
module GameModuleName {
    /*
     * Boot state for only loading the loading screen
     */
    export class BootState extends Phaser.State {
        constructor() {
            super();
        }

        init() {
            // Set scale using ScaleManager
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // Set background color            
        }

        preload() {
            // Load loading screen image
        }

        create() {
            // Start true loading state
            this.game.state.start("PreloadState");
        }
    }

    /*
     * Preload state for actually loading assets
     */
    export class PreloadState extends Phaser.State {
        constructor() {
            super();
        }

        preload() {
            // Display the loading screen image
            // Load assets

            // test square graphic
            let square = this.game.add.bitmapData(Square.WIDTH_AND_HEIGHT, Square.WIDTH_AND_HEIGHT);
            square.rect(0, 0, Square.WIDTH_AND_HEIGHT, Square.WIDTH_AND_HEIGHT, "rgb(255, 255, 255)");
            this.game.cache.addBitmapData("square", square);
        }

        create() {
            this.game.state.start("GameState");
        }
    }

    /*
     * A square that can be clicked on. May be a trapped mine or a reward square.
     */
    export class Square extends Phaser.Sprite {

        isTrapSqaure: boolean = false;
        isRewardSquare: boolean = false;
        static WIDTH_AND_HEIGHT: number = 32;

        constructor(gameState: GameState, x: number, y: number, key: Phaser.BitmapData) {
            super(gameState.game, x, y, key);

            let theGame = gameState; // For accessing the list of currently active squares and stuff.

            // Make the square clickable.
            this.inputEnabled = true;

            // Callback that handles what happens when this square is clicked on.
            this.events.onInputDown.add(() => {
                if (this.isTrapSqaure) {
                    console.log('boom'); // just a test, ugh
                    theGame.enterGameOverState();
                } else if (this.isRewardSquare) {
                    console.log('yatta!');
                    // Randomly destroy multiple squares. Traps won't get activated.
                    theGame.destroySquare(this); // Destroy this square, first, though.
                    let numberOfSquaresDestroyed = 0;
                    while (numberOfSquaresDestroyed != 10) {
                        if (theGame.allSquares.length < 1) {
                            break;
                        }
                        theGame.destroySquare(theGame.allSquares[Math.floor(Math.random() * (Math.floor(theGame.allSquares.length) - Math.ceil(0))) + Math.ceil(0)]);
                        numberOfSquaresDestroyed++;
                    }
                } else {
                    theGame.destroySquare(this);
                    console.log('safe!');
                }
            }, this);

            // Adding the sprite to the display list so that it can be displayed.
            this.game.stage.addChild(this);

            // Make the square either a trap, reward, or normal square.
            if (Math.random() <= 0.10) {
                this.isTrapSqaure = true;
            } else if (Math.random() <= 0.20) { // Otherwise, it's normal.
                this.isRewardSquare = true;
            }
        }
    }

    /*
     * The main game running state
     */
    export class GameState extends Phaser.State {
        game: Phaser.Game;

        // The following set of variables are for handling square field states and square fields themselves.
        allSquares: Array<Square>;
        widthMine: number = Square.WIDTH_AND_HEIGHT;
        heightMine: number = Square.WIDTH_AND_HEIGHT;
        safeSquaresRemaining: number;
        score: number;

        createSquareField(rows: number, columns: number) {
            let location = new Phaser.Point(0, 0); // location is the upper-left 2D vector position.
            this.allSquares = [];
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    this.allSquares.push(new Square(this, ((this.widthMine * j) + j) + location.x, ((this.heightMine * i) + i) + location.y, this.game.cache.getBitmapData("square")));
                }
            }
        }

        destroySquare(square: Square) {
            this.allSquares.splice(this.allSquares.indexOf(square), 1);
            this.safeSquaresRemaining--;
            square.destroy();
        }

        enterGameOverState() {

        }

        constructor() {
            super();
        }

        create() {
            //test
            this.createSquareField(10, 10);

            this.game.stage.backgroundColor = "#0d35a3";
        }

        update() {
        }
    }

    export class Game {
        game: Phaser.Game;

        constructor() {
            this.game = new Phaser.Game(550, 550, Phaser.AUTO, "phaser");

            /* The boot state will contain an init() for the scale manager and will load the loading screen,
             * while the preloader will display the loading screen and load assets and then start the main game state.
             */
            this.game.state.add("BootState", BootState, true);
            this.game.state.add("PreloadState", PreloadState);
            this.game.state.add("GameState", GameState);
        }
    }
}

window.onload = () => {
    let game = new GameModuleName.Game();
};