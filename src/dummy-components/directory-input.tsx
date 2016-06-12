import * as React from 'react';
const {Component, PropTypes} = React;
import {FlatButton} from 'material-ui';
import * as electron from 'electron';
const {dialog} = electron.remote;

interface DirectoryInputProps {
  onSelectDirectory: (directory: string) => void,
  onCancelDirectory: () => void,
  title: string,
  label: string
}

export default class DirectoryInput extends Component<DirectoryInputProps, {}> {
  static propTypes = {
      onSelectDirectory: PropTypes.func,
      onCancelDirectory: PropTypes.func,
      title: PropTypes.string,
      label: PropTypes.string
  }

  handleClick(){
    const opts : any = {
        title: this.props.title,
        properties: ['openDirectory']
    }

    dialog.showOpenDialog(opts, (response: string[]) => {
      if (response) {
        this.props.onSelectDirectory(response[0]);
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
