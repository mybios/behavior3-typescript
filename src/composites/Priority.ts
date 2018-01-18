import Composite from '../core/Composite';
import { FAILURE } from '../constants';
import Tick from '../core/Tick';
import BaseNode from '../core/BaseNode';

/**
 * Priority ticks its children sequentially until one of them returns
 * `SUCCESS`, `RUNNING` or `ERROR`. If all children return the failure state,
 * the priority also returns `FAILURE`.
 *
 * @module b3
 * @class Priority
 * @extends Composite
 **/

export default class Priority extends Composite {

    /**
     * Creates an instance of Priority.
     * @param {Object} params
     * @param {Array} params.children
     * @memberof Priority
     */
    constructor(children = new Array<BaseNode>()) {
        super(
            children,
            'Priority'
        );
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    tick(tick: Tick) {
        for (let i = 0; i < this.children.length; i++) {
            let status = this.children[i]._execute(tick);

            if (status !== FAILURE) {
                return status;
            }
        }

        return FAILURE;
    }
}
