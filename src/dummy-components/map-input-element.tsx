import * as React from 'react';
const {Component, PropTypes} = React;
import {FlatButton} from 'material-ui';

interface MapInputElementProps {
  name: string,
  value: string,
  onRemove: (name: string) => void,
  [name: string]: any
}

export default class MapInputElement extends Component<MapInputElementProps, {}> {
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
