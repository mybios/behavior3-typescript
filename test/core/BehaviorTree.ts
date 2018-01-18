import {spy, stub} from 'sinon';
import BehaviorTree from '../../src/core/BehaviorTree';
import {assert} from 'chai';
import BaseNode from '../../src/core/BaseNode';

// load and dump JSON model

suite('Core: Behavior Tree', function() {
    let getBlackboard = function() {
        return {
            'set': spy(),
            'get': stub()
        };
    };

    let getClosableNode = function(id) {
        return {
            'id': id,
            '_close': spy()
        };
    };

    test('Initialization', function() {
        let tree = new BehaviorTree();

        assert.isOk(tree.id);
        assert.isOk(tree.title);
        assert.isDefined(tree.description);
        assert.isDefined(tree.root);
        assert.isOk(tree.properties);
    });

    test('Call root', function() {
        let tree = new BehaviorTree();
        let node = {'_execute': stub()};
        let blackboard = getBlackboard();
        let target = {};

        blackboard.get.withArgs('openNodes', 'tree1')
                      .returns([]);

        tree.id = 'tree1';
        tree.root = node as any;
        tree.tick(target, blackboard);

        assert.isTrue(node._execute.calledOnce);
    });

    test('Populate blackboard', function() {
        let tree = new BehaviorTree();
        let blackboard = getBlackboard();
        let target = {};
        let node = {'_execute': function(tick) {
            tick._enterNode('node1'),
            tick._enterNode('node2');
        }};

        blackboard.get.withArgs('openNodes', 'tree1')
                      .returns([]);

        tree.id = 'tree1';
        tree.root = node as BaseNode;
        tree.tick(target, blackboard);

        let method = blackboard.set.withArgs('openNodes', ['node1', 'node2'], 'tree1');
        assert.isTrue(method.calledOnce);

        method = blackboard.set.withArgs('nodeCount', 2, 'tree1');
        assert.isTrue(method.calledOnce);
    });

    test('Close opened nodes', function() {
        let tree = new BehaviorTree();
        let blackboard = getBlackboard();


        let node1 = getClosableNode('node1');
        let node2 = getClosableNode('node2');
        let node3 = getClosableNode('node3');
        let node4 = getClosableNode('node4');
        let node5 = getClosableNode('node5');
        let node6 = getClosableNode('node6');
        let node7 = getClosableNode('node7');

        let root = {'_execute': function(tick) {
            tick._enterNode(node1);
            tick._enterNode(node2);
            tick._enterNode(node3);
        }};
        blackboard.get.withArgs('openNodes', 'tree1')
                      .returns([node1, node2, node3, node4, node5, node6, node7])
                      .withArgs('nodeCount', 'tree1')
                      .returns(7);


        tree.id = 'tree1';
        tree.root = root as BaseNode;
        tree.tick(null, blackboard);

        assert.isTrue(node7._close.calledOnce);
        assert.isTrue(node6._close.calledOnce);
        assert.isTrue(node5._close.calledOnce);
        assert.isTrue(node4._close.calledOnce);
        assert.isFalse(node3._close.called);
        assert.isFalse(node2._close.called);
        assert.isFalse(node1._close.called);
    });

    test('Does not close opened nodes', function() {
        let tree = new BehaviorTree();
        let blackboard = getBlackboard();

        let node1 = getClosableNode('node1');
        let node2 = getClosableNode('node2');
        let node3 = getClosableNode('node3');
        let node4 = getClosableNode('node4');

        let root = {'_execute': function(tick) {
            tick._enterNode(node1);
            tick._enterNode(node2);
            tick._enterNode(node3);
            tick._enterNode(node4);
        }};
        blackboard.get.withArgs('openNodes', 'tree1')
                      .returns([node1, node2])
                      .withArgs('nodeCount', 'tree1')
                      .returns(2);


        tree.id = 'tree1';
        tree.root = root as BaseNode;
        tree.tick(null, blackboard);

        assert.isFalse(node4._close.called);
        assert.isFalse(node3._close.called);
        assert.isFalse(node2._close.called);
        assert.isFalse(node1._close.called);
    });
});
