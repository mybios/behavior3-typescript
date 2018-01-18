import {stub} from 'sinon';
import {assert} from 'chai';
import TickStub from '../TickStub';
import RepeatUntilFailure from '../../src/decorators/RepeatUntilFailure';
import {SUCCESS, ERROR, RUNNING, FAILURE} from '../../src/constants';

suite('Decorator: RepeatUntilFailure', function() {
    test('Name', function() {
        assert.equal(new RepeatUntilFailure().name, 'RepeatUntilFailure');
    });

    test('Initialization', function() {
        let node = new RepeatUntilFailure();
        assert.equal(node.maxLoop, -1);
        assert.equal(node.name, 'RepeatUntilFailure');

        let node = new RepeatUntilFailure({maxLoop: 5});
        assert.equal(node.maxLoop, 5);
    });

    test('Test Maximum Repetition', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(SUCCESS);

        let node = new RepeatUntilFailure({maxLoop: 7, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 7);
        assert.equal(status, SUCCESS);
    });

    test('Test Repeat interruption (by FAILURE)', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(SUCCESS);
        child._execute.onCall(3).returns(FAILURE);

        let node = new RepeatUntilFailure({maxLoop: 50, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 4);
        assert.equal(status, FAILURE);
    });

    test('Test Repeat interruption (by RUNNING)', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(SUCCESS);
        child._execute.onCall(5).returns(RUNNING);

        let node = new RepeatUntilFailure({maxLoop: 50, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 6);
        assert.equal(status, RUNNING);
    });

    test('Test Repeat interruption (by ERROR)', function() {
        let tick = TickStub();
        tick.blackboard.get.returns(0);

        let child = {'_execute': stub()};
        child._execute.returns(SUCCESS);
        child._execute.onCall(3).returns(ERROR);

        let node = new RepeatUntilFailure({maxLoop: 50, child: child});

        let status = node._execute(tick);
        assert.equal(child._execute.callCount, 4);
        assert.equal(status, ERROR);
    });

});
