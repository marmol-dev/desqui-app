import Dispatcher from '../dispatcher';
import propertiesStore from '../stores/properties';
import * as React from 'react';
const {Component, PropTypes} = React;
import {TextField} from 'material-ui';

interface TextPropertyProps {
  name: string,
  value: string,
  [name: string]: any
}

export default class TextProperty extends Component<TextPropertyProps, {}> {

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
  }

  constructor(args: TextPropertyProps){
    super(args);
  }

  onChange({target: {value}}: {target: {value: string}}){
    Dispatcher.dispatch({
      type: 'PROPERTY_CHANGE',
      propertyName: this.props.name,
      propertyValue: value
    });
  }

  render(){
    return (
      <TextField
          onChange={this.onChange.bind(this)}
          {...this.props} />
    );
  }
}
