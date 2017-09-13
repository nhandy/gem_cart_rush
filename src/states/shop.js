import shopconfig from '../../assets/json/shop_config.json';
export default class ShopState extends Phaser.State {
    preload() {
        console.log('shop');
    }

    create() {
        this.game.stage.backgroundColor = '#182d3b';
        var data = new Image();
        data.src = '/assets/Back.png';
        this.game.cache.addImage('back_button', null, data);
        this.game.shopButton = this.game.add.button(0, 0, 'back_button', function(){this.game.state.start('MainMenu')}, this);
    }

    update() {
    }
};
