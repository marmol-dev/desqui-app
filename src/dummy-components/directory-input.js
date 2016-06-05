import React, {Component, PropTypes} from 'react';
import {FlatButton} from 'material-ui';
import * as electron from 'electron';
const {dialog} = electron.remote;

export default class DirectoryInput extends Component {
  static propTypes = {
      onSelectDirectory: PropTypes.func,
      onCancelDirectory: PropTypes.func,
      title: PropTypes.string,
      label: PropTypes.string
  }

  handleClick(){
    const opts = {
        title: this.props.title,
        properties: ['openDirectory']
    }

    dialog.showOpenDialog(opts, response => {
      if (response) {
        this.props.onSelectDirectory(response);
      } else {
        this.props.onCancelDirectory();
      }
    });
  }

  render(){
    return (
      <FlatButton onClick={this.handleClick.bind(this)} label={this.props.label} />
    );
  }
}
