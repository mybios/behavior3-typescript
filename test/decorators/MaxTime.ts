import {stub} from 'sinon';
import {assert} from 'chai';
import TickStub from '../TickStub';
import MaxTime from '../../src/decorators/MaxTime';
import {RUNNING, FAILURE, SUCCESS} from '../../src/constants';

suite('Decorator: MaxTime', function() {
    test('Name', function() {
        assert.equal(new MaxTime({maxTime: 15}).name, 'MaxTime');
    });

    test('Failure test', function() {
        let tick = TickStub();
        let child = {'_execute': stub()};
        child._execute.returns(RUNNING);

        let node = new MaxTime({maxTime: 15, child});
        let startTime = (new Date()).getTime();

        tick.blackboard.get.returns(startTime - 14);
        assert.equal(node.tick(tick), RUNNING);

        tick.blackboard.get.returns(startTime - 16);
        assert.equal(node.tick(tick), FAILURE);
    });

    test('Success test', function() {
        let tick = TickStub();
        let child = {'_execute': stub()};
        child._execute.returns(SUCCESS);

        let node = new MaxTime({maxTime: 15, child});
        let startTime = (new Date()).getTime();

        tick.blackboard.get.returns(startTime - 14);
        assert.equal(node.tick(tick), SUCCESS);
    });
});
