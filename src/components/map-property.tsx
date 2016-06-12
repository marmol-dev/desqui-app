import * as propertiesActions from '../actions/properties';
import * as React from 'react';
const {Component, PropTypes} = React;
import MapInput from '../dummy-components/map-input';
import assign = require('object-assign');

interface MapPropertyProps {
  label: string,
  name: string,
  value: any,
  [name: string]: any
}

export default class MapProperty extends Component<MapPropertyProps, {}> {

  static styles = {
    wrapper: {
      marginTop: 30
    }
  }

  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.object
  }

  constructor(args: MapPropertyProps){
    super(args);
  }

  onCreate({name, value}: {name: string, value:any}){
    const newValue = assign({}, this.props.value, {[name]: value});
    propertiesActions.changeProperty(this.props.name, newValue);
  }

  onRemove(name: string){
    const newValue = assign({}, this.props.value);
    delete newValue[name];
    propertiesActions.changeProperty(this.props.name, newValue);
  }

  render(){
    return (
      <div style={MapProperty.styles.wrapper}>
        <label>{this.props.label}</label>
        <MapInput onCreate={this.onCreate.bind(this)} onRemove={this.onRemove.bind(this)} value={this.props.value} />
      </div>
    );
  }
}
