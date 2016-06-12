import * as React from 'react';
const {Component, PropTypes} = React;
import {TextField, FlatButton} from 'material-ui';
import MapInputCreate from './map-input-create';
import MapInputElement from './map-input-element';

interface MapInputProps {
  onCreate: (a: {name: string, value:string}) => any,
  onRemove: (name: string) => any,
  value: any,
  [name: string]: any
}

export default class MapInput extends Component<MapInputProps, {}> {

  static propTypes = {
    onCreate: PropTypes.func,
    onRemove: PropTypes.func,
    value: PropTypes.object,
  }

  onCreate(element: {name: string, value: string}){
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
