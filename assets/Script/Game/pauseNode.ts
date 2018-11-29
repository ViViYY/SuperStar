
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {



    load () {
        
    }

    onBackgroundClick(): void{
        
    }

    onClose(): void{
        this.node.removeFromParent();
        this.node.destroy();
    }

    onContinue(): void{
        this.onClose();
    }

    onHome(): void{
        cc.director.loadScene("welcome");
    }

}
