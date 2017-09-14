import Cart from './cart';
import playerconfig from '../../assets/json/player_default.json';

export default class Player extends Phaser.Group {
    constructor (game) {
        super(game);
        this.playerinfo = playerconfig;
        this.enableBody = true;
        this.jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.jumping = 0;
        this.jumpable = 1;
        this.jumpButton = this.game.add.button(this.game.width - 250, 0, 'jumper');
        this.jumpButton.onInputDown.add(this.jumpButtonDown, this);
        this.jumpButton.onInputUp.add(this.jumpButtonUp, this);
    }

    resetPlay () {
        if (!this.cart) {
            this.cart = new Cart(this.game, 50, 430);
            this.add(this.cart);
        } else {
            this.cart.reset(50, 430);
        }
        this.game.add.existing(this.cart);
    }

    getInfo () {
        return this.playerinfo;
    }

    setInfo (key, value) {
        this.playerinfo[key] = value;
    }

    jumpButtonDown () {
        console.log("RUNNING jumpButtonDown ...");
        this.cart.isJumping |= 1;
    }

    jumpButtonUp () {
        console.log("RUNNING jumpButtonUp ...");
        this.cart.isJumping &= ~1;
    }

    update () {
        super.update();

        if (this.cart) {
            if (this.jumpKey.isDown) {
                this.cart.isJumping |= 2;
            } else {
                this.cart.isJumping &= ~2;
            }
        }
    }

    collectGem () {
        this.setInfo('gems', this.getInfo()['gems'] + 1);
    }
}
