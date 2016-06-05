import Dispatcher from '../dispatcher';
import propertiesStore from '../stores/properties';
import React , {Component, PropTypes} from 'react';
import MapProperty from './map-property';
import TextProperty from './text-property';
import DirectoryProperty from './directory-property';
import {Paper, RaisedButton, CircularProgress, FlatButton, Dialog, FloatingActionButton, ContentAdd} from 'material-ui';
import * as propertiesAction from '../actions/properties';
import {updateProfile} from '../actions/profiles';
import equal from 'deep-equal';
import {ProfilesStore} from '../stores/profiles';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';

export default class Form extends Component {

  static propTypes = {
    properties: PropTypes.object,
    isDownloading : PropTypes.bool,
    result: PropTypes.object,
    currentProfile: PropTypes.object
  }

  static styles = {
    spinner: {
      position: 'absolute',
      top: '50%',
      left: '50%'
    },
    wrapper: {
      padding: 20,
      marginTop: 54
    },
    ClearButton: {
      position: 'fixed',
      bottom: 20,
      right: 90
    },
    DownloadButton: {
      position: 'fixed',
      bottom: 20,
      right: 160
    },
    SaveButton: {
      position: 'fixed',
      bottom: 20,
      right: 20
    },
    LinearProgress: {
      position: 'fixed',
      bottom: '50%',
      right: '50%'
    }
  }

  constructor(args){
    super(args);
    this.styles = this.styles;
  }

  onDownload(){
    propertiesAction.downloadPage();
  }

  onClear(){
    propertiesAction.clearProperties();
  }

  handleCloseDialog(){
    propertiesAction.clearResult();
  }

  handleSaveProfile(){
    const profile = Object.assign({}, this.props.currentProfile, {properties: this.props.properties});
    updateProfile(profile);
  }

  render(){

    const actions = [(<FlatButton
        label="Close"
        primary
        onTouchTap={this.handleCloseDialog.bind(this)}
      />)];

    let dialog = null;
    if (this.props.result){
      if (this.props.result.error){
        dialog = (
          <Dialog actions={actions} title="Error!" modal open>
            {this.props.result.error.message}
          </Dialog>
        );
      } else {
        dialog = (
          <Dialog actions={actions} title="Success!" modal open>
            Page successfully saved in {this.props.result.data.dir}
          </Dialog>
        );
      }
    }


    const noChanges = equal(this.props.currentProfile.properties, this.props.properties);
    const fieldsClear = equal(this.props.properties, ProfilesStore.getDefaultValue()._profiles[0].properties);

    return (
      <Paper>
        <div style={Form.styles.wrapper}>

          <TextProperty fullWidth name="baseUrl" floatingLabelText="Base url" value={this.props.properties.baseUrl} /><br/>

          <TextProperty fullWidth name="urlLinks" floatingLabelText="Url links" value={this.props.properties.urlLinks} /><br/>

          <DirectoryProperty
              name="directory"
              title="Select save directory"
              floatingLabelText="Save directory"
              buttonLabel="Select" value={this.props.properties.directory} /><br/>

          <TextProperty fullWidth name="linksSelector" floatingLabelText="Links selector" value={this.props.properties.linksSelector} /><br/>

          <MapProperty name="selectors" label="Item selectors" value={this.props.properties.selectors} /><br/>

          <MapProperty name="headers" label="Headers" value={this.props.properties.headers} /><br/>

          <TextProperty multiLine
              fullWidth name="documentTitle"
              floatingLabelText="Document title" value={this.props.properties.documentTitle} /><br/>

          <TextProperty multiLine
              fullWidth name="documentFrontTemplate"
              floatingLabelText="Document front template" value={this.props.properties.documentFrontTemplate} /><br/>

          <TextProperty multiLine
              fullWidth name="itemTemplate" floatingLabelText="Item template" value={this.props.properties.itemTemplate} /><br/>

          <FloatingActionButton style={Form.styles.DownloadButton} onClick={this.onDownload.bind(this)} disabled={fieldsClear}>
            <DownloadIcon/>
          </FloatingActionButton>

          <FloatingActionButton style={Form.styles.ClearButton} onClick={this.onClear.bind(this)} disabled={fieldsClear}>
            <div>Clear</div>
          </FloatingActionButton>

          <FloatingActionButton style={Form.styles.SaveButton} onClick={this.handleSaveProfile.bind(this)} disabled={noChanges}>
            <div>Save</div>
          </FloatingActionButton>

          {this.props.isDownloading ? <CircularProgress style={Form.styles.LinearProgress} /> : null}
        </div>
        {dialog}
      </Paper>
    );
  }
}
