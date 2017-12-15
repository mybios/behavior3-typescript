import Action from '../core/Action';
import { RUNNING } from '../constants';
import Tick from '../core/Tick';

/**
 * This action node returns RUNNING always.
 *
 * @module b3
 * @class Runner
 * @extends Action
 **/
export default class Runner extends Action
{

    /**
     * Creates an instance of Runner.
     * @memberof Runner
     */
    constructor()
    {
        super('Runner');
    }

    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {Constant} Always return `RUNNING`.
     **/
    tick(tick: Tick)
    {
        return RUNNING;
    }
};
