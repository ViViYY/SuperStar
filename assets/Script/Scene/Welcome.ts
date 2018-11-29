import { GameData } from './../Util/GameData';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    tipsPrefab: cc.Prefab = null;

    _tipSHow: boolean = false;

    onLoad () {
        GameData.getInstance().loadCurrentData();
    }

    private onButtonStart () {
        let pattern = GameData.getInstance().starPattern;
        //检测是否有记录
        if(!this._tipSHow && pattern.length > 0){
            this._tipSHow = true;
            cc.log('提示');
            let tipsNode: cc.Node = cc.instantiate(this.tipsPrefab);
            tipsNode.parent = this.node;
            tipsNode.zIndex = 200;
            tipsNode.getComponent('Tips').setText("有上一次的游戏记录，再次点击[新游戏]按钮开始新的游戏？");
            return;
        }
        GameData.getInstance().isNewGame = true;
        GameData.getInstance().reset();
        cc.director.loadScene('game');
    }

    private onButtonContinue () {
        GameData.getInstance().isNewGame = false;
        cc.director.loadScene('game');
    }
}
