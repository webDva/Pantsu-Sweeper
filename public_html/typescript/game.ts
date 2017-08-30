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

        constructor(rows: number, columns: number) {
            this.createMinefield(rows, columns);
        }

        createMinefield(rows: number, columns: number) {

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