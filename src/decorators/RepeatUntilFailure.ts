import Decorator from '../core/Decorator';
import { SUCCESS, ERROR } from '../constants';
import BaseNode from '../core/BaseNode';
import Tick from '../core/Tick';

/**
 * RepeatUntilFailure is a decorator that repeats the tick signal until the
 * node child returns `FAILURE`, `RUNNING` or `ERROR`. Optionally, a maximum
 * number of repetitions can be defined.
 *
 * @module b3
 * @class RepeatUntilFailure
 * @extends Decorator
 **/

export default class RepeatUntilFailure extends Decorator {

    maxLoop: number;
    /**
     * Creates an instance of RepeatUntilFailure.
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @param {Object} params Object with parameters.
     * @param {Number} params.maxLoop Maximum number of repetitions. Default to -1 (infinite).
     * @param {BaseNode} params.child The child node.
     * @memberof RepeatUntilFailure
     **/
    constructor(maxLoop = -1, child: BaseNode = null) {
        super(
            child,
            'RepeatUntilFailure',
            'Repeat Until Failure',
            { maxLoop: -1 }
        );

        this.maxLoop = maxLoop;
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    open(tick: Tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    tick(tick: Tick) {
        if (!this.child) {
            return ERROR;
        }

        let i = tick.blackboard.get('i', tick.tree.id, this.id);
        let status = ERROR;

        while (this.maxLoop < 0 || i < this.maxLoop) {
            status = this.child._execute(tick);

            if (status == SUCCESS) {
                i++;
            } else {
                break;
            }
        }

        i = tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }
}
