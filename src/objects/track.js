export default class Track extends Phaser.Sprite {
    constructor (game, x, y) {
        super(game, x, y, 'track_str');

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.immovable = true;

        this.kill();
    }

    update () {
        if (this.x < -(this.width)) { // kill items when they are off the screen
            this.kill();
        }
    }
}
