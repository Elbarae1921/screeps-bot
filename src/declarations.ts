// An example of how to extend the global/Screeps types

import { CreepRole, CreepTargetId } from 'types';

declare global {
    interface Memory {
        index?: number;
        lastSource?: Id<Source>;
    }

    interface CreepMemory {
        role: CreepRole;
        formerRole?: CreepRole;
        target?: CreepTargetId;
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
