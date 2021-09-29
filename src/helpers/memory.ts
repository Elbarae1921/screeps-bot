export const cleanMemory = () => {
    if (Memory.creeps) {
        for (const name of Object.keys(Memory.creeps)) {
            const creep = Game.creeps[name];
            if (!creep) {
                delete Memory.creeps[name];
            }
        }
    }
};
