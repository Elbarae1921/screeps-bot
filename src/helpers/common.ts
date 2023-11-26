import { PRIORITY_BUILDS, STRUCTURES_TO_REPAIR } from './constants';

export const getCreepsArray = () => Object.keys(Game.creeps).map(x => Game.creeps[x]);

export const getRooms = () => Object.keys(Game.rooms).map(x => Game.rooms[x]);

export const getConstructionSites = (room: Room) =>
    room
        .find(FIND_CONSTRUCTION_SITES)
        .sort(
            (a, b) =>
                (PRIORITY_BUILDS[b.structureType] || 0) - (PRIORITY_BUILDS[a.structureType] || 0)
        );

export const getUsefulRuins = (room: Room) => {
    return [...room.find(FIND_RUINS), ...room.find(FIND_TOMBSTONES)]
        .filter(r => !!r.store)
        .filter(r => r.store.getUsedCapacity() > 0);
};

export const allowWithdrawFromSpawn = (room: Room) => {
    const creeps = room.find(FIND_MY_CREEPS);
    const miners = creeps.filter(c => c.memory.role === 'miner').length;
    const nonMinersCount = creeps.length - miners;
    return miners > nonMinersCount;
};

export const oppositeDirection = (direction: DirectionConstant): DirectionConstant =>
    (((direction + 3) % 8) + 1) as DirectionConstant;

export const getStructuresToBeRepaired = (room: Room) => {
    return (
        room
            .find(FIND_STRUCTURES)
            // only repair structures that have 10% or more damage
            .filter(s => (s.hitsMax - s.hits) / s.hitsMax > 0.1)
            .filter(s => STRUCTURES_TO_REPAIR.includes(s.structureType))
    );
};
