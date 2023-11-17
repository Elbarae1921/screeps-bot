export const PRIORITY_BUILDS: Record<string, number> = {
    container: 5,
    extension: 10
};

interface IRole {
    role: string;
    parts: BodyPartConstant[];
    count: number;
    maxParts: number;
    memory: CreepMemory;
    need: (param1?: ConstructionSite[], param2?: any) => boolean;
}

export const CREEP_ROLES_AND_PARTS: IRole[] = [
    {
        role: 'miner',
        parts: [WORK, CARRY, MOVE],
        count: 6,
        maxParts: 20,
        memory: {
            role: 'miner'
        },
        need: () => true
    },
    {
        role: 'upgrader',
        parts: [WORK, CARRY, MOVE],
        count: 2,
        maxParts: 20,
        memory: {
            role: 'upgrader'
        },
        need: () => true
    },
    {
        role: 'builder',
        parts: [WORK, CARRY, MOVE],
        count: 3,
        maxParts: 20,
        memory: {
            role: 'builder'
        },
        need: (constructionSites?: ConstructionSite[]) => !!constructionSites?.length
    },
    {
        role: 'ravager',
        parts: [CARRY, MOVE],
        count: 0,
        maxParts: 20,
        memory: {
            role: 'ravager'
        },
        need: (_, ruins?: (Ruin | Tombstone)[]) => !!ruins?.length
    }
];
