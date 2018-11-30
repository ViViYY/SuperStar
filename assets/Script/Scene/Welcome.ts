import { GameData } from './../Util/GameData';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Welcome extends cc.Component {

    @property(cc.Prefab)
    tipsPrefab: cc.Prefab = null;

    _tipSHow: boolean = false;

    sx: number = 1;
    sy: number = 1;

    onLoad () {
        GameData.getInstance().loadCurrentData();
        if(cc.sys.isBrowser){

        } else {
            this.getWindowProperty();
        }
    }

    private getWindowProperty ():void{
        let visibleSize: cc.Size;
        if(cc.sys.platform === cc.sys.ANDROID){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.IPHONE){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            visibleSize = cc.view.getCanvasSize();
        } else if(cc.sys.isBrowser){
            visibleSize = cc.view.getCanvasSize();
        } else {
            visibleSize = cc.view.getVisibleSize();
        }
        let designSize: cc.Size = cc.view.getDesignResolutionSize();
        let p1: number = designSize.width / designSize.height;
        let p2: number = visibleSize.width / visibleSize.height;
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        //真实运行环境比较宽
        if(p1 < p2){
            this.sx = visibleSize.width / (visibleSize.height / designSize.height * designSize.width);
        } else {
            this.sy = visibleSize.height / (visibleSize.width / designSize.width * designSize.height);
        }
        this.node.scaleX = this.sx;
        this.node.scaleY = this.sy;
    }

    private onButtonStart (): void {
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

    private onButtonContinue (): void {
        GameData.getInstance().isNewGame = false;
        cc.director.loadScene('game');
    }
}
