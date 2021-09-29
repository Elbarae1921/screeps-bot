export const creepBody = (maxParts: number, parts: BodyPartConstant[], energy: number) => {
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
