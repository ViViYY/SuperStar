
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterPass extends cc.Component {

    @property(cc.Label)
    chapterLabel: cc.Label = null;

    @property(cc.Label)
    targetLabel: cc.Label = null;

    @property(cc.Node)
    gameover: cc.Node = null;


    onLoad () {
        this.node.setPosition(434, 86);
        this.hide();
    }

    private show(): void{
        cc.log(" ChapterPass show ");
        this.gameover.opacity = 255;
        this.chapterLabel.node.opacity = 255;
        this.targetLabel.node.opacity = 255;
    }

    private hide(): void{
        cc.log(" ChapterPass hide ");
        this.gameover.opacity = 0;
        this.chapterLabel.node.opacity = 0;
        this.targetLabel.node.opacity = 0;
    }

    public showPass(chapter: number, targetScore: number, cb: Function): void{
        this.gameover.opacity = 0;
        this.chapterLabel.node.opacity = 255;
        this.targetLabel.node.opacity = 255;
        this.chapterLabel.string = "关卡：" + chapter.toString();
        this.targetLabel.string = "目标分数：" + targetScore.toString();
        
        this.showAction(cb);
    }

    public showOver(cb: Function): void{
        this.gameover.opacity = 255;
        this.chapterLabel.node.opacity = 0;
        this.targetLabel.node.opacity = 0;
        this.chapterLabel.string = "";
        this.targetLabel.string = "";
        
        this.showAction(cb);
    }

    private showAction(cb: Function): void{
        let moveAction: cc.FiniteTimeAction = cc.moveTo(3, cc.v2(-434, 86));
        let seq: cc.ActionInterval = cc.sequence(moveAction, cc.callFunc( () => {
            this.hide();
            if(cb){
                cb();
            }
        }));
        this.node.runAction(seq);
    }

}
