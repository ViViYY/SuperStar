
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    load () {

    }

    onClick(): void{
        this.node.removeFromParent();
        this.node.destroy();
    }

    public setText(str: string): void{
        this.label.string = str;
    }

}
