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
        }

        create() {
            this.game.state.start("GameState");
        }
    }

    /*
     * Mine class
     */
    export class Mine {
        x: number;
        y: number;
        isTrap: boolean = false;

        static WIDTH_AND_HEIGHT: number = 32;

        constructor(xPosition: number, yPosition: number) {
            this.x = xPosition;
            this.y = yPosition;
        }
    }

    /*
     * Handles the creation of minefields and manages states.
     */
    export class Minefield {
        mines: Array<Array<Mine>>; // Two dimensional array to contain the mines.
        widthMine: number = Mine.WIDTH_AND_HEIGHT;
        heightMine: number = Mine.WIDTH_AND_HEIGHT;

        constructor(rows: number, columns: number) {
            this.createMinefield(rows, columns, new Phaser.Point(0, 0));
        }

        createMinefield(rows: number, columns: number, location: Phaser.Point) { // location is the upper-left 2D vector position
            this.mines = [];
            for (let i = 0; i < rows; i++) {
                this.mines.push(new Array());
                for (let j = 0; j < columns; j++) {
                    this.mines[i].push(new Mine(this.widthMine * j * (2 + location.x), this.heightMine * i * (2 + location.y)));
                }
            }
        }
    }

    /*
     * The main game running state
     */
    export class GameState extends Phaser.State {
        game: Phaser.Game;

        constructor() {
            super();
        }

        create() {
            //test
            let minefield = new Minefield(3, 3);
            // now draw
            let square = this.game.add.bitmapData(Mine.WIDTH_AND_HEIGHT, Mine.WIDTH_AND_HEIGHT);
            square.rect(0, 0, Mine.WIDTH_AND_HEIGHT, Mine.WIDTH_AND_HEIGHT, "rgb(255, 255, 255)");
            this.game.cache.addBitmapData("square", square);
            for (let i = 0; i < minefield.mines.length; i++) {
                for (let j = 0; j < minefield.mines[i].length; j++) {
                    this.game.add.sprite(minefield.mines[i][j].x, minefield.mines[i][j].y, this.game.cache.getBitmapData("square"));
                }
            }
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