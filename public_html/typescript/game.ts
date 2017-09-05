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

        isTrap: boolean = false;
        static WIDTH_AND_HEIGHT: number = 32;

        constructor(game: Phaser.Game, x: number, y: number, key: Phaser.BitmapData) {
            super(game, x, y, key);

            // Make the square clickable.
            this.inputEnabled = true;

            // Callback to set the chosen square.
            this.events.onInputDown.add(() => {
                // test destroy
                this.destroy();
            }, this);

            // Adding the sprite to the display list so that it can be displayed.
            this.game.stage.addChild(this);
        }
    }

    /*
     * Handles the creation of minefields and manages states.
     */
    export class Minefield {
        mines: Array<Array<Square>>; // Two dimensional array to contain the mines.
        widthMine: number = Square.WIDTH_AND_HEIGHT;
        heightMine: number = Square.WIDTH_AND_HEIGHT;

        chosenSquare: Square; // The currently selected square.

        constructor(rows: number, columns: number, phaserGame: Phaser.Game) {
            this.createMinefield(rows, columns, new Phaser.Point(10, 10), phaserGame);
        }

        createMinefield(rows: number, columns: number, location: Phaser.Point, phaserGame: Phaser.Game) { // location is the upper-left 2D vector position
            this.mines = [];
            for (let i = 0; i < rows; i++) {
                this.mines.push(new Array());
                for (let j = 0; j < columns; j++) {
                    this.mines[i].push(new Square(phaserGame, ((this.widthMine * j) + j) + location.x, ((this.heightMine * i) + i) + location.y, phaserGame.cache.getBitmapData("square")));
                }
            }
        }
    }

    /*
     * The main game running state
     */
    export class GameState extends Phaser.State {
        game: Phaser.Game;

        mineField: Minefield;

        constructor() {
            super();
        }

        create() {
            //test
            this.mineField = new Minefield(10, 10, this.game);

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