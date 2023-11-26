import { CreepRole } from 'types';
import { getConstructionSites, getStructuresToBeRepaired } from './common';

export const buildCreepBody = (maxParts: number, parts: BodyPartConstant[], energy: number) => {
    const body: BodyPartConstant[] = [...parts];
    let remaining = energy - body.reduce((a, b) => a + BODYPART_COST[b], 0);
    while (remaining > 0 && body.length < maxParts) {
        for (const part of parts) {
            const partCost = BODYPART_COST[part];
            if (remaining < partCost || body.length >= maxParts) {
                return body;
            }
            body.push(part);
            remaining -= partCost;
        }
    }
    return body;
};

interface IRole {
    role: CreepRole;
    parts: BodyPartConstant[];
    count: (room: Room) => number;
    maxParts: number;
    memory: CreepMemory;
}

export const creepConfigByRole: IRole[] = [
    {
        role: CreepRole.Miner,
        parts: [WORK, CARRY, MOVE],
        count: () => 6,
        maxParts: 20,
        memory: {
            role: CreepRole.Miner
        }
    },
    {
        role: CreepRole.Upgrader,
        parts: [WORK, CARRY, MOVE],
        count: () => 2,
        maxParts: 20,
        memory: {
            role: CreepRole.Upgrader
        }
    },
    {
        role: CreepRole.Builder,
        parts: [WORK, CARRY, MOVE],
        count: (room: Room) => {
            const constructionSites = getConstructionSites(room);
            if (constructionSites.length) return 3;
            const structuresToBeRepaired = getStructuresToBeRepaired(room);
            return structuresToBeRepaired.length ? 2 : 0;
        },
        maxParts: 20,
        memory: {
            role: CreepRole.Builder
        }
    },
    {
        role: CreepRole.Ravager,
        parts: [CARRY, MOVE],
        count: _room => {
            // if (!getUsefulRuins(room).length) return 2;
            // temporary
            return 0;
        },
        maxParts: 20,
        memory: {
            role: CreepRole.Ravager
        }
    }
];
