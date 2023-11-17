import { PRIORITY_BUILDS } from './constants';

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

export const ALLOW_WITHDRAW_FROM_SPAWN = (room: Room) => {
    // return false;
    const creeps = room.find(FIND_MY_CREEPS);
    const miners = creeps.filter(c => c.memory.role === 'miner').length;
    const builders = creeps.filter(c => c.memory.role === 'builder').length;
    const upgraders = creeps.filter(c => c.memory.role === 'upgrader').length;
    return miners > builders + upgraders;
};

export const oppositeDirection = (direction: DirectionConstant): DirectionConstant =>
    (((direction + 3) % 8) + 1) as DirectionConstant;
