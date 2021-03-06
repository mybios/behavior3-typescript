import {spy, stub} from 'sinon';
import {assert} from 'chai';
import TickStub from '../TickStub';
import BaseNode from '../../src/core/BaseNode';
import {SUCCESS, RUNNING} from '../../src/constants';

suite('Core: BaseNode', function() {
    test('Initialization', function() {
        let node = new BaseNode();

        assert.isOk(node.id);
        assert.isDefined(node.name);
        assert.isDefined(node.category);
        assert.isDefined(node.title);
        assert.isDefined(node.description);
        assert.isOk(node.parameters);
        assert.isOk(node.properties);
        assert.isUndefined(node.children);
        assert.isUndefined(node.child);
    });

    test('Open Node', function() {
        let node = new BaseNode();
        let tick = TickStub();
        node.id = 'node1';
        node._execute(tick);

        let method = tick.blackboard.set.withArgs('isOpen', true, 'tree1', 'node1');
        assert.isTrue(method.calledOnce);
    });

    test('Close Node', function() {
        let node = new BaseNode();
        let tick = TickStub();
        node.id = 'node1';
        node._execute(tick);

        let method = tick.blackboard.set.withArgs('isOpen', false, 'tree1', 'node1');
        assert.isTrue(method.calledOnce);
    });

    test('Execute is calling functions?', function() {
        let node = new BaseNode();
        let tick = TickStub();

        tick.blackboard.get
            .withArgs('isOpen', 'tree1', 'node1')
            .returns(false);

        node.id    = 'node1';
        node.enter = spy();
        node.open  = spy();
        node.tick  = stub();
        (node.tick as any).returns(SUCCESS);
        node.close = spy();
        node.exit  = spy();
        node._execute(tick);

        assert.isTrue((node.enter as any).withArgs(tick).calledOnce);
        assert.isTrue((node.open as any).withArgs(tick).calledOnce);
        assert.isTrue((node.tick as any).withArgs(tick).calledOnce);
        assert.isTrue((node.close as any).withArgs(tick).calledOnce);
        assert.isTrue((node.exit as any).withArgs(tick).calledOnce);
    });

    test('Execute does not opening a node already open', function() {
        let node = new BaseNode();
        let tick = TickStub();

        tick.blackboard.get
            .withArgs('isOpen', 'tree1', 'node1')
            .returns(true);

        node.id = 'node1';
        node.open  = spy();
        node._execute(tick);

        assert.isTrue((node.open as any).neverCalledWith(tick));
    });

    test('Execute closing the node that does not returns RUNNING', function() {
        let node = new BaseNode();
        let tick = TickStub();

        tick.blackboard.get.returns(false);

        node.id = 'node1';
        node.close  = spy();
        node.tick  = stub();
        (node.tick as any).returns(RUNNING);
        node._execute(tick);

        assert.isTrue((node.close as any).neverCalledWith(tick));
    });

    test('Execute calling tick callbacks', function() {
        let node = new BaseNode();
        let tick = TickStub();

        tick.blackboard.get.returns(false);
        node._execute(tick);

        assert.isTrue(tick._enterNode.withArgs(node).calledOnce);
        assert.isTrue(tick._openNode.withArgs(node).calledOnce);
        assert.isTrue(tick._tickNode.withArgs(node).calledOnce);
        assert.isTrue(tick._closeNode.withArgs(node).calledOnce);
        assert.isTrue(tick._exitNode.withArgs(node).calledOnce);
    });

});
