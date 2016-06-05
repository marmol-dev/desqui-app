import React, {Component, PropTypes} from 'react';
import {TextField, FlatButton} from 'material-ui';

export default class MapInputCreate extends Component {

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

  handleChangeName(event){
    const newState = Object.assign({}, this.state);
    newState.name = event.target.value;
    this.setState(newState);
  }

  handleChangeValue(event){
    const newState = Object.assign({}, this.state);
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
