import * as React from 'react';
const {Component, PropTypes} = React;
import {TextField, FlatButton} from 'material-ui';
import assign = require('object-assign');

interface MapInputCreateProps {
  onCreate: (a : {name: string, value: string}) => any,
  [name:string]: any
}

interface MapInputCreateState {
  name: string,
  value: string
}

export default class MapInputCreate extends Component<MapInputCreateProps, MapInputCreateState> {

  static propTypes = {
    onCreate: PropTypes.func
  }

  constructor(){
    super();
    this.state = {
      name: '',
      value: ''
    };
  }

  handleChangeName(event: {target: {value: string}}){
    const newState = assign({}, this.state);
    newState.name = event.target.value;
    this.setState(newState);
  }

  handleChangeValue(event: {target: {value: string}}){
    const newState = assign({}, this.state);
    newState.value = event.target.value;
    this.setState(newState);
  }

  handleOnCreate(){
    this.props.onCreate(this.state)
    this.setState({name: '', value:''});
  }

  render(){
    return (
      <div>
        <TextField onChange={this.handleChangeName.bind(this)} value={this.state.name} floatingLabelText="Name" />
        <TextField onChange={this.handleChangeValue.bind(this)} value={this.state.value} floatingLabelText="Value" />
        <FlatButton label="Create" onClick={this.handleOnCreate.bind(this)} />
      </div>
    );
  }
}
