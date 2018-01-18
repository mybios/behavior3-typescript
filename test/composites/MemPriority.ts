import {stub} from 'sinon';
import {assert} from 'chai';
import TickStub from '../TickStub';
import MemPriority from '../../src/composites/MemPriority';
import {FAILURE, RUNNING, SUCCESS} from '../../src/constants';

suite('Composite: MemPriority', function() {
    let getNode = function(...args: any[]) {
        let _execute = stub();

        for (let i = 0; i < arguments.length; i++) {
            _execute.onCall(i).returns(arguments[i]);
        }

        return {'_execute': _execute};
    };

    test('Name', function() {
        assert.equal(new MemPriority().name, 'MemPriority');
    });

    test('Open', function() {
        let mpriority = new MemPriority();
        let tick = TickStub();
        mpriority.id = 'node1';
        mpriority.open(tick);

        let method = tick.blackboard.set.withArgs('runningChild', 0, 'tree1', 'node1');
        assert.isTrue(method.calledOnce);
    });

    test('Success', function() {
        let node1 = getNode(FAILURE);
        let node2 = getNode(SUCCESS);
        let node3 = getNode(SUCCESS);

        let mpriority = new MemPriority({children: [node1, node2, node3]});
        let tick = TickStub();
        tick.blackboard.get.returns(0);
        let status = mpriority.tick(tick);

        assert.equal(status, SUCCESS);
        assert.isTrue(node1._execute.calledOnce);
        assert.isTrue(node2._execute.calledOnce);
        assert.isFalse(node3._execute.called);
    });

    test('Failure', function() {
        let node1 = getNode(FAILURE);
        let node2 = getNode(FAILURE);
        let node3 = getNode(FAILURE);

        let mpriority = new MemPriority({children: [node1, node2, node3]});
        let tick = TickStub();
        tick.blackboard.get.returns(0);
        let status = mpriority.tick(tick);

        assert.equal(status, FAILURE);
        assert.isTrue(node1._execute.calledOnce);
        assert.isTrue(node2._execute.calledOnce);
        assert.isTrue(node3._execute.calledOnce);
    });

    test('Running', function() {
        let node1 = getNode(FAILURE);
        let node2 = getNode(FAILURE);
        let node3 = getNode(RUNNING);
        let node4 = getNode(SUCCESS);

        let mpriority = new MemPriority({children: [node1, node2, node3, node4]});
        let tick = TickStub();
        tick.blackboard.get.returns(0);
        let status = mpriority.tick(tick);

        assert.equal(status, RUNNING);
        assert.isTrue(node1._execute.calledOnce);
        assert.isTrue(node2._execute.calledOnce);
        assert.isTrue(node3._execute.calledOnce);
        assert.isFalse(node4._execute.called);
    });

    test('Memory Tick', function() {
        let node1 = getNode(FAILURE);
        let node2 = getNode(FAILURE);
        let node3 = getNode(RUNNING, FAILURE);
        let node4 = getNode(SUCCESS);
        let node5 = getNode(FAILURE);

        let mpriority = new MemPriority({children: [node1, node2, node3, node4, node5]});
        let tick = TickStub();
        mpriority.id = 'node1';

        // Execute two times, the first returning running, the second failure
        tick.blackboard.get.withArgs('runningChild', 'tree1', 'node1')
                           .returns(0);
        let status = mpriority._execute(tick);
        assert.equal(status, RUNNING);

        assert.isTrue(
            tick.blackboard.set
                .withArgs('runningChild', 0, 'tree1', 'node1')
                .calledOnce
        );
        assert.isTrue(
            tick.blackboard.set
                .withArgs('runningChild', 2, 'tree1', 'node1')
                .calledOnce
        );

        // second execute
        tick.blackboard.get.withArgs('runningChild', 'tree1', 'node1')
                           .returns(2);

        status = mpriority._execute(tick);
        assert.equal(status, SUCCESS);

        // Verifies the node activations
        assert.isTrue(node1._execute.calledOnce);
        assert.isTrue(node2._execute.calledOnce);
        assert.isTrue(node3._execute.calledTwice);
        assert.isTrue(node4._execute.calledOnce);
        assert.isFalse(node5._execute.called);
    });
});
