import Dispatcher from '../dispatcher';
import propertiesStore from '../stores/properties';
import React , {Component, PropTypes} from 'react';
import {TextField} from 'material-ui';

export default class TextProperty extends Component {

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
  }

  constructor(args){
    super(args);
  }

  onChange({target: {value}}){
    Dispatcher.dispatch({
      type: 'PROPERTY_CHANGE',
      propertyName: this.props.name,
      propertyValue: value
    });
  }

  render(){
    const {name, value, ...other} = this.props;
    return (
      <TextField
          name={name}
          value={value}
          onChange={this.onChange.bind(this)}
          {...other} />
    );
  }
}
