export default class Item extends Phaser.Sprite {
    constructor (game, x, y, key, frame) {
        super(game, x, y, key, frame);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.player = this.game.player;
        this.spawnRate = 1; // value between 0 and 1, 1 means always 0 means practically never
        this.events.onInputDown.add(this.clicked, this);
    }

    update () {
        if (this.x < this.width - 100) { // kill items when they are off the screen
            this.destroy();
        } else {
            this.game.physics.arcade.overlap(this, this.player, () => {this.collided()});
        }
    }

    clicked () {
        console.log('Something Clicked');
    }

    collided () {
        console.log('Something Collided');
    }
}
