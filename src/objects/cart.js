export default class Cart extends Phaser.Sprite {
    constructor (game, x, y) {
        super(game, x, y, 'cart_str');

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.gravity.y = 200;
        this.body.collideWorldBounds = true;
        this.body.checkCollision.up = true;
        this.body.checkCollision.down = true;

        this.events = this.events || {};
        this.events.speedUpdated = new Phaser.Signal();

        this.booster = 0;
    }

    syncSpeed () {
        let modifier = 0;
        let fixPosition = false;

        if (this.body.x > 150) {
            modifier = 20;
            fixPosition = true;
        } else if (this.body.x < 20) {
            modifier = -20;
            fixPosition = true;
        } else if (fixPosition && (this.body.x >= 70 && this.body.x <= 80)) {
            // Move the cart until it gets up to full speed
            this.events.speedUpdated.dispatch(-(this.body.velocity.x));
        } else {
            if (this.body.velocity.x < (300 + this.booster)) {
                this.body.velocity.x += 10;
            // Move the cart until it gets back close to full speed
        } else if (this.body.velocity.x > (200 + this.booster + 20)) {
                this.body.velocity.x -= 10;
            }
        }
        if (modifier) {
            this.events.speedUpdated.dispatch(-(this.body.velocity.x + modifier));
        }
    }

    update () {
        this.syncSpeed();
    }
}
