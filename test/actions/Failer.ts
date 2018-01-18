import {assert} from 'chai';
import TickStub from '../TickStub';
import Failer from '../../src/actions/Failer';
import {FAILURE} from '../../src/constants';

suite('Action: Failer', function() {
    test('Name', function() {
        assert.equal(new Failer().name, 'Failer');
    });

    test('Tick', function() {
        let failer = new Failer();

        let status = failer._execute(TickStub());
        assert.equal(status, FAILURE);
    });
});
