import propertiesStore from '../stores/properties';
import React , {Component, PropTypes} from 'react';
import {TextField} from 'material-ui';
import DirectoryInput from '../dummy-components/directory-input';
import * as propertiesActions from '../actions/properties';
import TextProperty from './text-property';

export default class DirectoryProperty extends Component {

  static propTypes = {
    buttonLabel: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    title: PropTypes.string
  }

  constructor(args){
    super(args);
  }

  handleSelectDirectory(directory){
    propertiesActions.changeProperty(this.props.name, directory);
  }

  render(){
    const {buttonLabel, name, value, title, ...other} = this.props;
    return (
      <div>
        <TextProperty name={this.props.name} value={this.props.value} {...other} />
        <DirectoryInput title={this.props.title}
          label={this.props.buttonLabel}
          onSelectDirectory={this.handleSelectDirectory.bind(this)}
          onCancelDirectory={()=>{}}/>
      </div>
    );
  }
}
