import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { countUp, countDown } from './action';

class App extends Component {
  render() {
    return (
      <div>
        <h2>Count: {this.props.count}</h2>
        <button onClick={this.props.countUp}>+</button>
        <button onClick={this.props.countDown}>-</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    count: state.count
  };
}

export default connect(mapStateToProps, {
  countDown,
  countUp
})(App);
