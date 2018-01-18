import BehaviorTree from './BehaviorTree';
import Blackboard from './Blackboard';
import BaseNode from './BaseNode';

/**
 * A new Tick object is instantiated every tick by BehaviorTree. It is passed
 * as parameter to the nodes through the tree during the traversal.
 *
 * The role of the Tick class is to store the instances of tree, debug,
 * target and blackboard. So, all nodes can access these informations.
 *
 * For internal uses, the Tick also is useful to store the open node after
 * the tick signal, in order to let `BehaviorTree` to keep track and close
 * them when necessary.
 *
 * This class also makes a bridge between nodes and the debug, passing the
 * node state to the debug if the last is provided.
 *
 * @module b3
 * @class Tick
 **/

export default class Tick {


    /**
     * The tree reference.
     * @property {b3.BehaviorTree} tree
     * @readOnly
     **/
    tree: BehaviorTree = null;

    /**
     * The debug reference.
     * @property {Object} debug
     * @readOnly
     */
    debug: Object = null;

    /**
     * The target object reference.
     * @property {Object} target
     * @readOnly
     **/
    target: Object = null;

    /**
     * The blackboard reference.
     * @property {b3.Blackboard} blackboard
     * @readOnly
     **/
    blackboard: Blackboard = null;

    // updated during the tick signal

    /**
     * The list of open nodes. Update during the tree traversal.
     * @property {Array} _openNodes
     * @protected
     * @readOnly
     **/
    _openNodes: BaseNode[] = [];

    /**
     * The number of nodes entered during the tick. Update during the tree
     * traversal.
     *
     * @property {Integer} _nodeCount
     * @protected
     * @readOnly
     **/
    _nodeCount = 0;
    /**
     * Initialization method.
     * @method initialize
     * @constructor
     **/
    constructor() {
        // set by BehaviorTree

    }

    /**
     * Called when entering a node (called by BaseNode).
     * @method _enterNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    _enterNode(node: BaseNode) {
        this._nodeCount++;
        this._openNodes.push(node);

        // TODO: call debug here
    }

    /**
     * Callback when opening a node (called by BaseNode).
     * @method _openNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    _openNode(node: BaseNode) {
        // TODO: call debug here
    }

    /**
     * Callback when ticking a node (called by BaseNode).
     * @method _tickNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    _tickNode(node: BaseNode) {
        // TODO: call debug here
    }

    /**
     * Callback when closing a node (called by BaseNode).
     * @method _closeNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    _closeNode(node: BaseNode) {
        // TODO: call debug here
        this._openNodes.pop();
    }

    /**
     * Callback when exiting a node (called by BaseNode).
     * @method _exitNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    _exitNode(node: BaseNode) {
        // TODO: call debug here
    }
}
