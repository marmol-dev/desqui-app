import propertiesStore from '../stores/properties';
import * as React from 'react';
const {Component, PropTypes} = React;
import {TextField} from 'material-ui';
import DirectoryInput from '../dummy-components/directory-input';
import * as propertiesActions from '../actions/properties';
import TextProperty from './text-property';



interface DirectoryPropertyProps {
  buttonLabel: string,
  name: string,
  value: string,
  title: string
  [name: string]: any
}

export default class DirectoryProperty extends Component<DirectoryPropertyProps, {}> {

  static propTypes = {
    buttonLabel: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    title: PropTypes.string

  }

  constructor(args: DirectoryPropertyProps){
    super(args);
  }

  handleSelectDirectory(directory: string){
    propertiesActions.changeProperty(this.props.name, directory);
  }

  render(){
    //const {buttonLabel, name, value, title, ...other} = this.props;
    return (
      <div>
        <TextProperty name={this.props.name} value={this.props.value} {...this.props} />
        <DirectoryInput title={this.props.title}
          label={this.props.buttonLabel}
          onSelectDirectory={this.handleSelectDirectory.bind(this)}
          onCancelDirectory={()=>{}}/>
      </div>
    );
  }
}
