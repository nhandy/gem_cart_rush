import playerconfig from '../../assets/json/player_default.json';
export default class Player extends Phaser.Group {
    constructor (game) {
        super(game);
        this.playerinfo = playerconfig;
        this.enableBody = true;
        game.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.jumpKey = game.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    getInfo () {
        return this.playerinfo;
    }
    setInfo (key, value) {
        this.playerinfo[key] = value;
    }
    update () {
        //console.log("RUNNING PLAYER UPDATE ...");
        if (this.jumpKey.isDown) {
            console.log("JUMPING");
        }
    }
}
