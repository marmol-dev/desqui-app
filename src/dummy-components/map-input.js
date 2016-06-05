import React, {Component, PropTypes} from 'react';
import {TextField, FlatButton} from 'material-ui';
import MapInputCreate from './map-input-create';
import MapInputElement from './map-input-element';

export default class MapInput extends Component {

  static propTypes = {
    onCreate: PropTypes.func,
    onRemove: PropTypes.func,
    value: PropTypes.object
  }

  onCreate(element){
    this.props.onCreate(element);
  }

  render(){
    const elements = Object.keys(this.props.value).map((name, i) => (
      <li key={name}>
        <MapInputElement  name={name} value={this.props.value[name]} onRemove={this.props.onRemove} />
      </li>
    ));

    return (
      <div>
        <MapInputCreate onCreate={this.onCreate.bind(this)} />
        {elements.length ? <ul>{elements}</ul> : null}
      </div>
    );
  }
}
