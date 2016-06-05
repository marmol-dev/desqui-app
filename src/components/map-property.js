import * as propertiesActions from '../actions/properties';
import React , {Component, PropTypes} from 'react';
import MapInput from '../dummy-components/map-input';

export default class MapProperty extends Component {

  static styles = {
    wrapper: {
      marginTop: 30
    }
  }

  static propTypes = {
    label: PropTypes.string,
    hintText: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.object
  }

  constructor(args){
    super(args);
  }

  onCreate({name, value}){
    const newValue = Object.assign({}, this.props.value, {[name]: value});
    propertiesActions.changeProperty(this.props.name, newValue);
  }

  onRemove(name){
    const newValue = Object.assign({}, this.props.value);
    delete newValue[name];
    propertiesActions.changeProperty(this.props.name, newValue);
  }

  render(){
    return (
      <div style={MapProperty.styles.wrapper}>
        <label>{this.props.label}</label>
        <small>{this.props.hintText}</small>
        <MapInput onCreate={this.onCreate.bind(this)} onRemove={this.onRemove.bind(this)} value={this.props.value} />
      </div>
    );
  }
}
