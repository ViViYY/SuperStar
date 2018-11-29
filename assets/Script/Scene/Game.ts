import { GameData } from './../Util/GameData';
import { Define } from '../Util/Define';

const {ccclass, property} = cc._decorator;

@ccclass
export class Game extends cc.Component {

    @property(cc.Node)
    layerStar: cc.Node = null;

    @property(cc.Label)
    labelChapter: cc.Label = null;

    @property(cc.Label)
    labelTargetScore: cc.Label = null;

    @property(cc.Label)
    labelHistory: cc.Label = null;

    @property(cc.Label)
    labelScore: cc.Label = null;

    @property(cc.Label)
    labelScoreAdd: cc.Label = null;

    @property(cc.Node)
    passNode: cc.Node = null;

    @property(cc.Prefab)
    pausePrefab: cc.Prefab = null;


    onLoad (){
        this.passNode.active = false;
        this.labelScoreAdd.node.opacity = 0;
        cc.director.on("chapter-start", this.gotoNextChapter, this);
        cc.director.on("score-refresh", this.scoreRefresh, this);
        cc.director.on("chapter-pass", this.pass, this);
        this.startGame();
    }

    onDestroy (){
        cc.director.off("chapter-start", this.startGame, this);
        cc.director.off("score-refresh", this.scoreRefresh, this);
        cc.director.off("chapter-pass", this.pass, this);
    }

    //到下一关的动画
    private gotoNextChapter(): void{
        GameData.getInstance().isNewGame = true;
        this.startGame();
    }

    //过关
    private pass(): void{
        this.passNode.active = true;
        this.passNode.setPosition(0, 0);
        let ac: cc.FiniteTimeAction = cc.moveTo(1, cc.v2(156, 229));
        this.passNode.runAction(ac);
    }
    
    //分数变化
    private scoreRefresh(scoreAdd: number = 0): void{
        this.labelChapter.string = GameData.getInstance().chapter.toString();
        this.labelScore.string = GameData.getInstance().score.toString();
        this.labelTargetScore.string = GameData.getInstance().getTargetScore().toString();
        this.labelHistory.string = GameData.getInstance().getHistoryChapter(GameData.getInstance().chapter).toString();
        if( scoreAdd > 0 ){
            this.labelScoreAdd.string = scoreAdd.toString();
            this.labelScoreAdd.node.opacity = 255;
            this.labelScoreAdd.node.stopAllActions();
            let ac: cc.FiniteTimeAction = cc.fadeOut(2).easing(cc.easeBounceIn());
            this.labelScoreAdd.node.runAction(ac);
        }
    }

    private startGame(): void{
        this.scoreRefresh();
        this.layerStar.getComponent('StarController').initStar();
    }

    private checkPass(): void{
        if(GameData.getInstance().score >= GameData.getInstance().getTargetScore()){
            this.pass();
        }
    }

    onPause (): void {
        cc.log('onPause');
        // GameData.getInstance().removeStorageData();
        let pauseNode: cc.Node = cc.instantiate(this.pausePrefab);
        pauseNode.parent = this.node;
        pauseNode.zIndex = 200;
    }



}
