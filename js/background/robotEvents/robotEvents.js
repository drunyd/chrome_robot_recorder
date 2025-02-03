//Base Command Class
export class RobotEvent {
    constructor(message){
        this.target = message.target;
        this.details = message.details;
    }
}

//Click Command
export class RobotClickEvent extends Command {
    constructor(message){
        super(message);
        this.type = 'click';
        this.x = message.x;
        this.y = message.y;
    }
}

//Input Command
export class RobotInputEvent extends Command {
    constructor(message){
        super(message);
        this.type = 'input';
        this.value = message.value;
    }
}
