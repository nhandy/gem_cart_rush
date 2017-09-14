import Item from '../item';

export default class Bomb extends Item {
    constructor (game, x, y) {
        super(game, x, y, 'bomb');

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.scale.x = this.scale.y = 0.25;
    }
}
