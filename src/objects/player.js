import Cart from './cart';
import playerconfig from '../../assets/json/player_default.json';

export default class Player extends Phaser.Group {
    constructor (game) {
        super(game);
        this.playerinfo = playerconfig;
        this.enableBody = true;
        this.jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        this.cart = new Cart(this.game, 50, 430);
        this.add(this.cart);
    }
    getInfo () {
        return this.playerinfo;
    }
    setInfo (key, value) {
        this.playerinfo[key] = value;
    }
    update () {
        super.update();

        if (this.jumpKey.isDown) {
            console.log("JUMPING");
        }
    }
}
