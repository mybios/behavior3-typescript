import {stub, spy} from 'sinon';
import {assert} from 'chai';
import Priority from '../../src/composites/Priority';
import {FAILURE, SUCCESS, RUNNING} from '../../src/constants';

suite('Composite: Priority', function() {
    let getNode = function(status) {
        let _execute = stub();
        _execute.returns(status);

        return {'_execute': _execute};
    };

    let getTick = function() {
        return {
            'tickNode': spy()
        };
    };

    test('Name', function() {
        assert.equal(new Priority().name, 'Priority');
    });

    test('Success', function() {
        let node1 = getNode(FAILURE);
        let node2 = getNode(SUCCESS);
        let node3 = getNode(SUCCESS);

        let sequence = new Priority({children: [node1, node2, node3]});
        let status = sequence.tick(getTick());

        assert.equal(status, SUCCESS);
        assert.isTrue(node1._execute.calledOnce);
        assert.isTrue(node2._execute.calledOnce);
        assert.isFalse(node3._execute.called);
    });

    test('Failure', function() {
        let node1 = getNode(FAILURE);
        let node2 = getNode(FAILURE);
        let node3 = getNode(FAILURE);

        let sequence = new Priority({children: [node1, node2, node3]});
        let status = sequence.tick(getTick());

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

        let sequence = new Priority({children: [node1, node2, node3, node4]});
        let status = sequence.tick(getTick());

        assert.equal(status, RUNNING);
        assert.isTrue(node1._execute.calledOnce);
        assert.isTrue(node2._execute.calledOnce);
        assert.isTrue(node3._execute.calledOnce);
        assert.isFalse(node4._execute.called);
    });
});
