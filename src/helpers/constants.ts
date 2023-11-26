export const PRIORITY_BUILDS: Record<string, number> = {
    [STRUCTURE_ROAD]: 2,
    [STRUCTURE_CONTAINER]: 5,
    // [STRUCTURE_STORAGE]: 10,
    // [STRUCTURE_EXTENSION]: 15
    // TODO: temporary
    [STRUCTURE_STORAGE]: 15,
    [STRUCTURE_EXTENSION]: 10
};

export const PRIORITY_REPAIRS: Record<string, number> = {
    [STRUCTURE_CONTAINER]: 5,
    [STRUCTURE_ROAD]: 10
};

export const STRUCTURES_TO_REBUILD: Structure['structureType'][] = [
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_ROAD,
    STRUCTURE_STORAGE
];

export const STRUCTURES_TO_REPAIR: Structure['structureType'][] = [
    STRUCTURE_CONTAINER,
    STRUCTURE_ROAD
];
