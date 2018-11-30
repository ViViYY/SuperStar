
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    chapterLabel: cc.Label = null;

    @property(cc.Label)
    targetLabel: cc.Label = null;

    @property(cc.Node)
    gameover: cc.Node = null;


    load () {
        this.node.setPosition(434, 86);
    }

    public showPass(chapter: number, targetScore: number, cb: Function): void{
        this.gameover.opacity = 0;
        this.chapterLabel.string = "关卡：" + chapter.toString();
        this.targetLabel.string = "目标分数：" + targetScore.toString();
        
        this.showAction(cb);
    }

    public showOver(cb: Function): void{
        this.gameover.opacity = 255;
        this.chapterLabel.string = "";
        this.targetLabel.string = "";
        
        this.showAction(cb);
    }

    private showAction(cb: Function): void{
        this.node.setPosition(434, 86);
        let moveAction: cc.FiniteTimeAction = cc.moveTo(3, cc.v2(-434, 86));
        let seq: cc.ActionInterval = cc.sequence(moveAction, cc.callFunc(function () {
            if(cb){
                cb();
            }
        }));
        this.node.runAction(seq);
    }

}
