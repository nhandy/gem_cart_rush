// import states
import BootState from './states/boot';
import MainMenuState from './states/main-menu';
import ShopState from './states/shop';
import PlayState from './states/play';

require('dotenv');
if (!process.env.ELECTRON) {
    require('./index.html');
}

let game = new Phaser.Game(800, 600);

Phaser.Device.whenReady(function () {
    // plugins
    game.__plugins = game.__plugins || {};

    // add plugins here
    // ...

    // setup global namespace under game for our global data
    game.global = {};

    game.global.asset_path = process.env.ELECTRON ? '/' : '/assets/';

    // states
    game.state.add('Boot', BootState);
    game.state.add('MainMenu', MainMenuState);
    game.state.add('Shop', ShopState);
    game.state.add('Play', PlayState);

    game.state.start('Boot');
});
