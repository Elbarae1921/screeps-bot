// An example of how to extend the global/Screeps types

declare global {
    interface Memory {
        index?: number;
        lastSource?: Source;
    }

    interface CreepMemory {
        role: string;
        target?: Source | Structure;
        shouldMine?: boolean;
    }

    interface Creep {
        wander(): CreepMoveReturnCode;
        memory: CreepMemory;
    }
}

export function injectMethods(): void {
    Creep.prototype.wander = function (): CreepMoveReturnCode {
        if (!this.fatigue) {
            const direction = (Math.floor(Math.random() * 8) + 1) as DirectionConstant;
            return this.move(direction);
        } else return ERR_TIRED;
    };
}
