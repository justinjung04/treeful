import React, { Component } from 'react';
import Treeful from '../../../src/treeful-dev';

export default class CounterControl extends Component {
	increment() {
		Treeful.setData('counter', Treeful.getData('counter') + 1);
	}

	decrement() {
		Treeful.setData('counter', Treeful.getData('counter') - 1);
	}

	render() {
		return (
			<div>
				<button onClick={this.increment}>Increment</button>
				<button onClick={this.decrement}>Decrement</button>
			</div>
		);
	}
}