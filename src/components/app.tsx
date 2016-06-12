import clone = require('clone');
import * as React from 'react';
const {Component, PropTypes} = React;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const lightMuiTheme = getMuiTheme(lightBaseTheme);

import Header from '../dummy-components/header';
import Form from './form';
import {Drawer, MenuItem, FlatButton, IconButton, TextField, Divider} from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RenameIcon from 'material-ui/svg-icons/editor/mode-edit';
import OpenIcon from 'material-ui/svg-icons/action/visibility';

import SaveIcon from 'material-ui/svg-icons/content/save';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';

import {blue500, red500, greenA200} from 'material-ui/styles/colors';


import propertiesStore , {Result} from '../stores/properties';
import profilesStore, {ProfilesStore, Properties, Profile} from '../stores/profiles';

import {createProfile, openProfile, removeProfile, updateProfile, exportData, importData} from '../actions/profiles';

import * as electron from 'electron';
const {dialog} = electron.remote;
import assign = require('object-assign');

interface AppState {
  properties: Properties,
  isDownloading: boolean,
  result: Result,
  menuOpened: boolean,
  profiles: Profile[],
  currentProfile: Profile
}

export default class App extends Component<{}, AppState> {
  constructor(args: {}) {
      super(args);
      this.state = {
        properties: propertiesStore.getProperties(),
        isDownloading: propertiesStore.isDownloading(),
        result: propertiesStore.getResult(),
        menuOpened: false,
        profiles: profilesStore.getProfiles(),
        currentProfile: profilesStore.getProfile(profilesStore.getCurrentProfileId())
      };
  }



  componentWillMount(){
    propertiesStore.on('change', this.setNewState.bind(this));
    profilesStore.on('change', this.setNewState.bind(this));
  }

  setNewState(){
    this.setState({
      properties: propertiesStore.getProperties(),
      isDownloading: propertiesStore.isDownloading(),
      result: propertiesStore.getResult(),
      menuOpened: this.state.menuOpened,
      profiles: profilesStore.getProfiles(),
      currentProfile: profilesStore.getProfile(profilesStore.getCurrentProfileId())
    });
  }

  handleMenu(opened: boolean){
    const newState = assign({}, this.state);
    newState.menuOpened = opened;
    this.setState(newState);
  }

  handleOpenMenu(){
    this.handleMenu(true);
  }

  handleCreateProfile(){
    createProfile({properties: this.state.properties});
  }

  handleOpenProfile(id: number){
    openProfile(id);
  }

  handleRemoveProfile(id: number){
    removeProfile(id);
  }

  handleStartRenamingProfile(id: number){
    const profile = profilesStore.getProfile(id);
    const newProfile = assign(clone(profile), {
      isEditing: true,
      editingName: profile.name
    });
    updateProfile(newProfile);
  }

  handleUpdateName(id: number, e: any){
    console.log('evento', e);
    const editingName = e.target.value;
    const profile = profilesStore.getProfile(id);
    const newProfile = assign(clone(profile),{editingName});
    updateProfile(newProfile);
  }

  handleCancelRenaming(id: number){
    const profile = profilesStore.getProfile(id);
    const newProfile = assign(clone(profile),{isEditing: false});
    updateProfile(newProfile);
  }

  handleSaveName(id: number){
    const profile = profilesStore.getProfile(id);
    const name = profile.editingName;
    const newProfile = assign(clone(profile),{isEditing: false, name});
    updateProfile(newProfile);
  }

  handleExport(){
    const opts = {
      title: 'Save profiles and data',
      filters: [
        {
          name: 'JSON files',
          extensions: ['json']
        }
      ]
    };

    dialog.showSaveDialog(opts, path => {
      if (path) {
        exportData(path);
      }
    });
  }

  handleImport(){
    const opts: any = {
      title: 'Import profiles and data',
      filters: [
        {
          name: 'JSON files',
          extensions: ['json']
        }
      ],
      properties: ['openFile']
    };

    dialog.showOpenDialog(opts, (paths: string[]) => {
      if (paths) {
        importData(paths[0]);
      }
    });
  }

  render() {
    const profiles = profilesStore.getProfiles().map(({id, name, isEditing, editingName}) => {

      let buttons: any;

      const openButton = (
        <IconButton onClick={()=>{this.handleOpenProfile(id)}}>
          <OpenIcon/>
        </IconButton>
      );

      if (!isEditing){
        const removeButton = id !== 0 ? (
          <IconButton onClick={()=>{this.handleRemoveProfile(id)}}>
            <DeleteIcon color={red500} />
          </IconButton>
        ) : null;

        const renameButton = (
          <IconButton onClick={()=>{this.handleStartRenamingProfile(id)}}>
            <RenameIcon/>
          </IconButton>
        );

        buttons = (
          <div>
            {openButton}
            {renameButton}
            {removeButton}
          </div>
        );
      } else {
        const cancelButton = (
          <IconButton onClick={(e)=>{this.handleCancelRenaming(id)}}>
            <CancelIcon />
          </IconButton>
        );

        const saveButton = (
          <IconButton onClick={(e)=>{this.handleSaveName(id)}}>
            <SaveIcon/>
          </IconButton>
        );

        buttons = (
          <div>
            {openButton}
            {cancelButton}
            {saveButton}
          </div>
        );
      }

      let item: any = null;

      if (isEditing){
        item = (<TextField name={id.toString()} value={editingName} onChange={(event) => {this.handleUpdateName(id, event)}}/>);
      } else {
        item = (<a onClick={()=>{this.handleOpenProfile(id)}}>{name}</a>);
      }

      return (
        <MenuItem key={id} rightIconButton={buttons}>
          {item}
        </MenuItem>
      );
    });

    return (
      <MuiThemeProvider muiTheme={lightMuiTheme}>
        <div>
          <Header handleOpenMenu={this.handleOpenMenu.bind(this)} title={this.state.currentProfile.name} />
          <Drawer width={350} docked={false} open={this.state.menuOpened} onRequestChange={this.handleMenu.bind(this)}>
            <MenuItem onClick={this.handleCreateProfile.bind(this)} key="create">Create profile</MenuItem>
            <Divider/>
            {profiles}
            <Divider/>
            <MenuItem onClick={this.handleExport.bind(this)} key="export">
              Export data
            </MenuItem>
            <MenuItem onClick={this.handleImport.bind(this)} key="import">
              Import data
            </MenuItem>
            <Divider />
            <MenuItem>by @tomymolina</MenuItem>
          </Drawer>
          <Form currentProfile={this.state.currentProfile} result={this.state.result} isDownloading={this.state.isDownloading} properties={this.state.properties} />
        </div>
      </MuiThemeProvider>
    );
  }
}
