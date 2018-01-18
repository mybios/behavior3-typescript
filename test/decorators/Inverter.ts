import {stub} from 'sinon';
import {assert} from 'chai';
import TickStub from '../TickStub';
import Inverter from '../../src/decorators/Inverter';
import {SUCCESS, FAILURE, ERROR, RUNNING} from '../../src/constants';

suite('Decorator: Inverter', function() {
    test('Name', function() {
        assert.equal(new Inverter().name, 'Inverter');
    });

    test('Initialization', function() {
        let node = new Inverter();
        assert.equal(node.name, 'Inverter');
    });

    test('Inverting Values', function() {
        let tick = TickStub();
        let child = {'_execute': stub()};
        let node = new Inverter({child: child});
        let status = 0;

        child._execute.returns(SUCCESS);
        status = node._execute(tick);
        assert.equal(status, FAILURE);

        child._execute.returns(FAILURE);
        status = node._execute(tick);
        assert.equal(status, SUCCESS);
    });

    test('Running and Error', function() {
        let tick = TickStub();
        let child = {'_execute': stub()};
        let node = new Inverter({child: child});
        let status = 0;

        child._execute.returns(RUNNING);
        status = node._execute(tick);
        assert.equal(status, RUNNING);

        child._execute.returns(ERROR);
        status = node._execute(tick);
        assert.equal(status, ERROR);
    });

});
