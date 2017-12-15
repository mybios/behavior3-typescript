import Decorator from '../core/Decorator';
import { FAILURE, SUCCESS, ERROR } from '../constants';
import Tick from '../core/Tick';
import BaseNode from '../core/BaseNode';

/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
 **/

export default class Inverter extends Decorator
{

    /**
     * Creates an instance of Inverter.
     * @param {Object} params
     * @param {BaseNode} params.child The child node.
     * @memberof Inverter
     */
    constructor(child: BaseNode = null)
    {
        super(
            child,
            'Inverter'
        );
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

        var status = this.child._execute(tick);

        if (status == SUCCESS)
        {
            status = FAILURE;
        } else if (status == FAILURE)
        {
            status = SUCCESS;
        }

        return status;
    }
};
