import Treeful from '../src/treeful';
import expect from 'expect';

describe('treeful', () => {

	/** constructor **/

	it('exposes the public api without instanciating', () => {
		const methods = Object.keys(Treeful);
		expect(methods).toContain('add');
		expect(methods).toContain('set');
		expect(methods).toContain('get');
		expect(methods).toContain('subscribe');
		expect(methods).toContain('shake');
		expect(methods).toContain('destroy');
		expect(methods).toContain('increment');
		expect(methods).toContain('decrement');
		expect(methods).toContain('toggle');
		expect(methods).toContain('push');
		expect(methods).toContain('pop');
		expect(methods).toContain('assign');
		expect(methods).toContain('toString');
		expect(methods).toContain('dev');
	});

	it('creates the root node automatically', () => {
		const tree = Treeful.getTree();
		const nodes = Object.keys(tree);
		expect(nodes).toContain('root');
	});

	/** addNode **/

	it('adds a node to a parent node with data', () => {
		Treeful.add('1');
		Treeful.add('2', 10, '1');
		const children = Object.keys(Treeful.getChildren('1'));
		expect(children).toContain('2');
		expect(Treeful.get('2')).toEqual(10);
		Treeful.destroy();
	});

	it('allows chaining of addNode function', () => {
		expect(() => {
			Treeful.add('1').add('2').add('3', null, '1');
		}).toNotThrow();
		Treeful.destroy();
	});

	it('defaults to null if data is not passed to node', () => {
		Treeful.add('1');
		expect(Treeful.get('1')).toEqual(null);
		Treeful.destroy();
	});

	it('adds a node to root if parent is not specified', () => {
		Treeful.add('1');
		expect(Object.keys(Treeful.getChildren('root'))).toContain('1');
		Treeful.destroy();
	});

	it('automatically creates a callback for every node', () => {
		Treeful.add('1');
		expect(Treeful.getCallbacks('1').length).toEqual(1);
		Treeful.destroy();
	});

	/** getData **/

	it('gets data from a node', () => {
		Treeful.add('1', 10);
		expect(Treeful.get('1')).toEqual(10);
		Treeful.destroy();
	});

	/** setData **/

	it('sets data of a node', () => {
		Treeful.add('1');
		expect(Treeful.get('1')).toEqual(null);
		Treeful.set('1', 10);
		expect(Treeful.get('1')).toEqual(10);
		Treeful.destroy();
	});

	it('accepts function and sets data of a node', () => {
		Treeful.add('1', 1);
		Treeful.set('1', (e) => {
			return e + 1;
		});
		expect(Treeful.get('1')).toEqual(2);
		Treeful.destroy();
	});

	/** subscribe **/

	it('calls callback functions when a node\'s data is changed, and passes data', () => {
		let d1 = 0;
		const cb1 = (data) => {
			d1 = data;
		};
		Treeful.add('1');
		Treeful.subscribe('1', cb1);
		Treeful.set('1', 10);
		expect(d1).toEqual(10);
		Treeful.destroy();
	});

	it('tells you which node was updated when callback is called', () => {
		let n1 = '';
		const cb1 = (data, node) => {
			n1 = node;
		};
		Treeful.add('1');
		Treeful.add('2', 10, '1');
		Treeful.subscribe('1', cb1);
		Treeful.set('2', 20);
		expect(n1).toEqual('2');
		Treeful.destroy();
	});

	it('allows multiple subscriptions on a single node', () => {
		Treeful.add('1', 10);
		Treeful.subscribe('1', () => {
			return true;
		});
		Treeful.subscribe('1', () => {
			return false;
		});
		let callbacks = Treeful.getCallbacks('1').length;
		expect(callbacks).toEqual(3);
		Treeful.destroy();
	});

	it('calls callback when a child node is updated', () => {
		let d1 = 0;
		const cb1 = (data) => {
			d1 = data;
		};
		Treeful.add('1');
		Treeful.add('2', 10, '1');
		Treeful.subscribe('1', cb1);
		Treeful.set('2', 20);
		expect(d1).toEqual(20);
		Treeful.destroy();
	});

	it('calls callback when a child of a child node is updated', () => {
		let d1 = 0;
		const cb1 = (data) => {
			d1 = data;
		};
		Treeful.add('1');
		Treeful.add('2', 0, '1');
		Treeful.add('3', 0, '2');
		Treeful.subscribe('1', cb1);
		Treeful.set('3', 10);
		expect(d1).toEqual(10);
		Treeful.destroy();
	});

	it('ignores updates from child when ignore flag is set', () => {
		let d1 = 0;
		const cb1 = (data) => {
			d1 = data;
		};
		Treeful.add('1');
		Treeful.add('2', 10, '1');
		Treeful.subscribe('1', cb1, true);
		Treeful.set('2', 20);
		expect(d1).toEqual(0);
		Treeful.destroy();
	});

	it('returns an unsubscribe function when you call subscribe', () => {
		let d1 = 0;
		const cb1 = (data) => {
			d1 = data;
		};
		Treeful.add('1', 10);
		const unsub = Treeful.subscribe('1', cb1);
		unsub();
		Treeful.set('1', 20);
		expect(Treeful.getCallbacks('1').length).toEqual(1);
		expect(d1).toEqual(0);
		Treeful.destroy();
	});

	it('unsubscribes only the specified callback function from the node', () => {
		let d1 = 0;
		let d2 = 0;
		const cb1 = (data) => {
			d1 = data;
		};
		const cb2 = (data) => {
			d2 = data;
		};
		Treeful.add('1', 10);
		let unsub1 = Treeful.subscribe('1', cb1);
		Treeful.subscribe('1', cb2);
		unsub1();
		Treeful.set('1', 20);
		expect(Treeful.getCallbacks('1').length).toEqual(2);
		expect(d1).toEqual(0);
		expect(d2).toEqual(20);
		unsub1 = Treeful.subscribe('1', cb1);
		unsub1();
		Treeful.set('1', 30);
		expect(Treeful.getCallbacks('1').length).toEqual(2);
		expect(d1).toEqual(0);
		expect(d2).toEqual(30);
		Treeful.destroy();
	});

	/** shake **/

	it('shakes a node without changing data', () => {
		let d1 = 0;
		const cb1 = () => {
			d1 = 10;
		};
		Treeful.add('1', 20);
		Treeful.subscribe('1', cb1);
		Treeful.shake('1');
		expect(d1).toEqual(10);
		expect(Treeful.get('1')).toEqual(20);
		Treeful.destroy();
	});

	it('shakes parent node without changing data', () => {
		let d1 = 0;
		const cb1 = () => {
			d1 = 10;
		};
		Treeful.add('1', 20);
		Treeful.add('2', 30, '1');
		Treeful.add('3', 40, '2');
		Treeful.subscribe('1', cb1);
		Treeful.shake('3');
		expect(d1).toEqual(10);
		expect(Treeful.get('3')).toEqual(40);
		Treeful.destroy();
	});

	/** destroy **/

	it('resets tree when destroy is called', () => {
		Treeful.add('1');
		Treeful.destroy();
		let children = Object.keys(Treeful.getChildren('root'));
		expect(children.length).toEqual(0);
		Treeful.destroy();
	});

	/** incrementData / decrementData **/

	it('increments/decrements number when incrementData/decrementData is called', () => {
		Treeful.add('1', 0);
		Treeful.increment('1');
		expect(Treeful.get('1')).toEqual(1);
		Treeful.increment('1', 2);
		expect(Treeful.get('1')).toEqual(3);
		Treeful.decrement('1');
		expect(Treeful.get('1')).toEqual(2);
		Treeful.decrement('1', 2);
		expect(Treeful.get('1')).toEqual(0);
		Treeful.destroy();
	});

	/** toggleData **/

	it('toogles boolean when toggleData is called', () => {
		Treeful.add('1', true);
		Treeful.toggle('1');
		expect(Treeful.get('1')).toEqual(false);
		Treeful.toggle('1');
		expect(Treeful.get('1')).toEqual(true);
		Treeful.destroy();
	});

	/** pushData / popData **/

	it('pushes/pops item to an array when pushData/popData is called', () => {
		Treeful.add('1', []);
		Treeful.push('1', 10);
		Treeful.push('1', 20);
		expect(Treeful.get('1')[0]).toEqual(10);
		expect(Treeful.get('1')[1]).toEqual(20);
		expect(Treeful.pop('1')).toEqual(20);
		expect(Treeful.get('1').length).toEqual(1);
		Treeful.destroy();
	});

	/** assignData **/

	it('assigns data to the object when assignData is called', () => {
		Treeful.add('1', { test1: 1 });
		Treeful.assign('1', { test1: 2 });
		expect(Treeful.get('1')).toEqual({ test1: 2 });
		Treeful.assign('1', { test2: 'string' });
		expect(Treeful.get('1')).toEqual({ test1: 2, test2: 'string' });
		Treeful.destroy();
	});

	/** print **/

	it('converts tree object to a string', () => {
		Treeful.add('1', 'first node')
			.add('2', { second: 'node' })
			.add('3', [ 1, 2 ])
			.add('4', 12)
			.add('5', false);
		expect(Treeful.toString()).toContain('root: null');
		expect(Treeful.toString()).toContain('1: first node');
		expect(Treeful.toString()).toContain('2: {');
		expect(Treeful.toString()).toContain('second: node');
		expect(Treeful.toString()).toContain('}');
		expect(Treeful.toString()).toContain('3: [');
		expect(Treeful.toString()).toContain('1,');
		expect(Treeful.toString()).toContain('2');
		expect(Treeful.toString()).toContain(']');
		expect(Treeful.toString()).toContain('4: 12');
		expect(Treeful.toString()).toContain('5: false');
		Treeful.destroy();
	});

	/** checkIdExists **/

	it('throws if a node id doesn\'t exist', () => {
		Treeful.add('1');
		expect(() => {
			Treeful.get('2');
		}).toThrow(/is not found/);
		Treeful.destroy();
	});

	/** checkIdType **/

	it('throws if id is not a string', () => {
		expect(() => {
			Treeful.add(1);
		}).toThrow(/Id must be a string/);
		Treeful.destroy();
	});

	/** checkIfDataIsFunction **/

	it('throws if a function is passed as data', () => {
		expect(() => {
			Treeful.add('1', () => {
				return false;
			});
		}).toThrow(/Data cannot be a function/);
		Treeful.destroy();
	});

	/** checkDataType **/

	it('throws if data type does not match an expected type', () => {
		Treeful.add('1', true);
		expect(() => {
			Treeful.increment('1');
		}).toThrow(/Data type must be a/);
		Treeful.destroy();
	});

	/** checkDuplicate **/

	it('throws if id is a duplicate', () => {
		Treeful.add('1');
		expect(() => {
			Treeful.add('1');
		}).toThrow(/Cannot use duplicate id/);
		Treeful.destroy();
	});

	/** checkCallbackType **/

	it('throws if callback is not a function', () => {
		Treeful.add('1');
		expect(() => {
			Treeful.subscribe('1', 10);
		}).toThrow(/Callback must be a function/);
		Treeful.destroy();
	});

	/** checkTypeMutation **/

	it('throws if data mutation is attempted', () => {
		Treeful.add('1', 10);
		expect(() => {
			Treeful.set('1', 'string');
		}).toThrow(/Data type cannot be mutated from/);
		Treeful.destroy();
	});
});
