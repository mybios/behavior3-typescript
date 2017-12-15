import Decorator from '../core/Decorator';
import { FAILURE, ERROR } from '../constants';
import BaseNode from '../core/BaseNode';
import Tick from '../core/Tick';

/**
 * The MaxTime decorator limits the maximum time the node child can execute.
 * Notice that it does not interrupt the execution itself (i.e., the child
 * must be non-preemptive), it only interrupts the node after a `RUNNING`
 * status.
 *
 * @module b3
 * @class MaxTime
 * @extends Decorator
 **/

export default class MaxTime extends Decorator
{

    maxTime: number;
    /**
     * Creates an instance of MaxTime.
     * 
     * - **maxTime** (*Integer*) Maximum time a child can execute.
     * - **child** (*BaseNode*) The child node.
  
     * @param {Object} params Object with parameters.
     * @param {Number} params.maxTime Maximum time a child can execute.
     * @param {BaseNode} params.child The child node.
     * @memberof MaxTime
     */
    constructor(maxTime = 0, child: BaseNode = null)
    {
        super(
            child,
            'MaxTime',
            'Max <maxTime>ms',
            { maxTime: 0 },
        );

        if (!maxTime)
        {
            throw 'maxTime parameter in MaxTime decorator is an obligatory parameter';
        }

        this.maxTime = maxTime;
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    open(tick: Tick)
    {
        var startTime = (new Date()).getTime();
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    tick(tick: Tick)
    {
        if (!this.child)
        {
            return ERROR;
        }

        var currTime = (new Date()).getTime();
        var startTime = tick.blackboard.get('startTime', tick.tree.id, this.id);

        var status = this.child._execute(tick);
        if (currTime - startTime > this.maxTime)
        {
            return FAILURE;
        }

        return status;
    }
};
