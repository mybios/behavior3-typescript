import {stub} from 'sinon';
import {assert} from 'chai';
import TickStub from '../TickStub';
import RepeatUntilSuccess from '../../src/decorators/RepeatUntilSuccess';
import {SUCCESS, FAILURE, RUNNING, ERROR} from '../../src/constants';

suite('Decorator: RepeatUntilSuccess', function() {
    test('Name', function() {
        assert.equal(new RepeatUntilSuccess().name, 'RepeatUntilSuccess');
    });

    test('Initialization', function() {
        let node = new RepeatUntilSuccess();
        assert.equal(node.maxLoop, -1);
        assert.equal(node.name, 'RepeatUntilSuccess');

        let node = new RepeatUntilSuccess({maxLoop: 5});
        assert.equal(node.maxLoop, 5);
    });

    test('Test Maximum Repetition', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(FAILURE);

        let node = new RepeatUntilSuccess({maxLoop: 7, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 7);
        assert.equal(status, FAILURE);
    });

    test('Test Repeat interruption (by SUCCESS)', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(FAILURE);
        child._execute.onCall(3).returns(SUCCESS);

        let node = new RepeatUntilSuccess({maxLoop: 50, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 4);
        assert.equal(status, SUCCESS);
    });

    test('Test Repeat interruption (by RUNNING)', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(FAILURE);
        child._execute.onCall(5).returns(RUNNING);

        let node = new RepeatUntilSuccess({maxLoop: 50, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 6);
        assert.equal(status, RUNNING);
    });

    test('Test Repeat interruption (by ERROR)', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(FAILURE);
        child._execute.onCall(3).returns(ERROR);

        let node = new RepeatUntilSuccess({maxLoop: 50, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 4);
        assert.equal(status, ERROR);
    });

});
