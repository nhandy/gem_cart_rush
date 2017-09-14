import Cart from './cart';
import playerconfig from '../../assets/json/player_default.json';

export default class Player extends Phaser.Group {
    constructor (game) {
        super(game);
        this.playerinfo = playerconfig;
        this.enableBody = true;
        this.jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.jumping = 0;
        this.jumpButton = this.game.add.button(this.game.width - 250, 0, 'jumper');
        this.jumpButton.onInputDown.add(this.jumpButtonDown, this);
        this.jumpButton.onInputUp.add(this.jumpButtonUp, this);

        this.cart = new Cart(this.game, 50, 430);
        this.add(this.cart);
    }
    getInfo () {
        return this.playerinfo;
    }
    setInfo (key, value) {
        this.playerinfo[key] = value;
    }
    jumpButtonDown () {
        console.log("RUNNING jumpButtonDown ...");
        this.jumping |= 1;
    }
    jumpButtonUp() {
        console.log("RUNNING jumpButtonUp ...");
        this.jumping &= ~1;
    }
    update () {
        super.update();

        if (this.jumpKey.isDown) {
            this.jumping |= 2;
        }
        else {
            this.jumping &= ~2;
        }

        if (this.jumping) {
            console.log("JUMPING: " + this.jumping);
            this.cart.body.velocity.x  = 0;
            this.cart.body.velocity.y -= 15;
        }
    }
    collectGem() {
        this.setInfo('gems', this.getInfo()['gems'] + 1);
    }
}
