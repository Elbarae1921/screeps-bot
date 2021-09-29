import { buildersWorker } from './builders';
import { minersWorker } from './miners';
import { ravagersWorker } from './ravagers';
import { upgradersWorker } from './upgraders';

export const creepWorkers = () => {
    minersWorker();
    // TODO: improve buildersWorker (loop through rooms)
    buildersWorker();
    ravagersWorker();
    upgradersWorker();
};
