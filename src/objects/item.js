export default class Item extends Phaser.Sprite {
    constructor (game, x, y, key, frame) {
        super(game, x, y, key, frame);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.spawnRate = 1; // value between 0 and 1, 1 means always 0 means practically never
    }

    update () {
        if (this.x < this.width) { // kill items when they are off the screen
            this.destroy();
        }
    }
}
