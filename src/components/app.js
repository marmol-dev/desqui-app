import clone from 'clone';
import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const lightMuiTheme = getMuiTheme(lightBaseTheme);

import Header from '../dummy-components/header';
import Form from './form';
import {Drawer, MenuItem, FlatButton, IconButton, TextField, Divider} from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RenameIcon from 'material-ui/svg-icons/editor/title';
import OpenIcon from 'material-ui/svg-icons/action/visibility';

import SaveIcon from 'material-ui/svg-icons/content/save';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';

import {blue500, red500, greenA200} from 'material-ui/styles/colors';


import propertiesStore from '../stores/properties';
import profilesStore, {ProfilesStore} from '../stores/profiles';

import {createProfile, openProfile, removeProfile, updateProfile, exportData, importData} from '../actions/profiles';

import * as electron from 'electron';
const {dialog} = electron.remote;

export default class App extends Component {
  constructor(args) {
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

  handleMenu(opened){
    const newState = Object.assign({}, this.state);
    newState.menuOpened = opened;
    this.setState(newState);
  }

  handleOpenMenu(){
    this.handleMenu(true);
  }

  handleCreateProfile(){
    createProfile({properties: this.state.properties});
  }

  handleOpenProfile(id){
    openProfile(id);
  }

  handleRemoveProfile(id){
    removeProfile(id);
  }

  handleStartRenamingProfile(id){
    const profile = profilesStore.getProfile(id);
    const newProfile = Object.assign(clone(profile), {
      isEditing: true,
      editingName: profile.name
    });
    updateProfile(newProfile);
  }

  handleUpdateName(id, editingName){
    const profile = profilesStore.getProfile(id);
    const newProfile = Object.assign(clone(profile),{editingName});
    updateProfile(newProfile);
  }

  handleCancelRenaming(id){
    const profile = profilesStore.getProfile(id);
    const newProfile = Object.assign(clone(profile),{isEditing: false});
    updateProfile(newProfile);
  }

  handleSaveName(id){
    const profile = profilesStore.getProfile(id);
    const name = profile.editingName;
    const newProfile = Object.assign(clone(profile),{isEditing: false, name});
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
    const opts = {
      title: 'Import profiles and data',
      filters: [
        {
          name: 'JSON files',
          extensions: ['json']
        }
      ],
      properties: ['openFile']
    };

    dialog.showOpenDialog(opts, (paths) => {
      if (paths) {
        importData(paths[0]);
      }
    });
  }

  render() {
    const profiles = profilesStore.getProfiles().map(({id, name, isEditing, editingName}) => {

      let buttons;

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

      return (
        <MenuItem key={id} rightIconButton={buttons}>
          {!isEditing ?
            (<a onClick={()=>{this.handleOpenProfile(id)}}>{name}</a>) :
            (<TextField value={editingName} onChange={e=>{this.handleUpdateName(id, e.target.value)}} id={id.toString()}/>)
          }
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
