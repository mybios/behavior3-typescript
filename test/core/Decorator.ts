import {assert} from 'chai';
import Decorator from '../../src/core/Decorator';
import {DECORATOR} from '../../src/constants';

suite('Core: Decorator', function() {
    test('Category', function() {
        assert.equal(new Decorator().category, DECORATOR);
    });

    test('Initialization', function() {
        let node = new Decorator({child: 'child1'});

        assert.isOk(node.id);
        assert.isDefined(node.title);
        assert.isDefined(node.description);
        assert.equal(node.child, 'child1' as any);
        assert.equal(node.category, 'decorator');
    });

    test('Empty constructor', function() {
        let node = new Decorator();

        assert.isDefined(node.child);
        assert.equal(node.child, null);
    });
});
