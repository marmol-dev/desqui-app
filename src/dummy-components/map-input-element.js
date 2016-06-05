import React, {Component, PropTypes} from 'react';
import {FlatButton} from 'material-ui';

export default class MapInputElement extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onRemove: PropTypes.func
  }

  onRemove(){
    this.props.onRemove(this.props.name);
  }

  render(){
    return (
      <div key={this.props.name}>
        <strong>{this.props.name}:</strong>
        <span>{this.props.value}</span>
        <FlatButton label="Remove" onClick={this.onRemove.bind(this)} />
      </div>
    );
  }
}
