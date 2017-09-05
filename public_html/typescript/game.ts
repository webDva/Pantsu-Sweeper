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

        constructor(game: Phaser.Game, x: number, y: number, key: Phaser.BitmapData) {
            super(game, x, y, key);

            // Make the square clickable.
            this.inputEnabled = true;

            // Callback to set the chosen square.
            this.events.onInputDown.add(() => {
                if (this.isTrapSqaure) {
                    console.log('boom'); // just a test, ugh
                } else if (this.isRewardSquare) {
                    console.log('yatta!');
                } else {
                    console.log('safe!');
                }
                this.destroy();
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
        allSquares: Array<Array<Square>>; // Two dimensional array to contain the square.
        widthMine: number = Square.WIDTH_AND_HEIGHT;
        heightMine: number = Square.WIDTH_AND_HEIGHT;
        chosenSquare: Square; // The currently selected square.        

        createSquareField(rows: number, columns: number) {
            let location = new Phaser.Point(0, 0); // location is the upper-left 2D vector position.
            this.allSquares = [];
            for (let i = 0; i < rows; i++) {
                this.allSquares.push(new Array());
                for (let j = 0; j < columns; j++) {
                    this.allSquares[i].push(new Square(this.game, ((this.widthMine * j) + j) + location.x, ((this.heightMine * i) + i) + location.y, this.game.cache.getBitmapData("square")));
                }
            }
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