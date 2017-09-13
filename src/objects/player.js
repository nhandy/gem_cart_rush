import playerconfig from '../../assets/json/player_default.json';
export default class Player extends Phaser.Group {
    constructor(game)
    {
        super(game);
        this.playerinfo = playerconfig;
        this.enableBody = true;
    }
    getInfo()
    {
        return this.playerinfo;
    }
    setInfo(key, value)
    {
        this.playerinfo[key] = value;
    }
}
