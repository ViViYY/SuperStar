import { GameData } from './../Util/GameData';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad () {

    }

    private onButtonStart () {
        GameData.getInstance().reset();
        cc.director.loadScene('game');
    }

    private onButtonContinue () {
        cc.director.loadScene('game');
    }
}
