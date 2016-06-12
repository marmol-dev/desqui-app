import dispatcher from '../dispatcher';
import {EventEmitter} from 'events';
import pick = require('object.pick');
import * as clone from 'clone';
import assign = require('object-assign');
import find = require('array-find');
import findIndex = require('array-findindex');



export interface Properties {
  baseUrl: string,
  urlLinks: string,
  directory: string,
  linksSelector : string,
  selectors: {
    [name: string]: string
  },
  headers: {
    [name: string]: string
  },
  documentFrontTemplate: string,
  itemTemplate : string,
  documentTitle: string
}

export interface Profile {
  id: number,
  name: string,
  properties: Properties,
  isEditing: boolean,
  editingName: string
}

interface ProfilesStoreAtributes {
  _profiles: Profile[],
  _currentProfileId: number
}

export interface ProfilesStoreAtributesExport extends ProfilesStoreAtributes {
  __desqui: boolean
}

export class ProfilesStore extends EventEmitter {
  static getDefaultValue() : ProfilesStoreAtributes {
    return {
      _profiles : [
        {
          id: 0,
          name: 'Default profile',
          properties: {
            baseUrl: '',
            urlLinks: '',
            directory: '',
            linksSelector : '',
            selectors: {},
            headers: {},
            documentFrontTemplate: '',
            itemTemplate : '',
            documentTitle: ''
          },
          isEditing: false,
          editingName: null
        }
      ],
      _currentProfileId: 0,
    }
  }

  private _profiles: Profile[];
  private _currentProfileId: number;

  constructor(initialValue: ProfilesStoreAtributesExport){
    super();
    if (initialValue){
      this.fromJSON(initialValue);
    } else {
      assign(this, ProfilesStore.getDefaultValue());
    }
  }

  getProfile(id: number){
    return clone(find(this._profiles, profile => profile.id === id));
  }

  getProfiles(){
    return this._profiles;
  }

  updateProfile(profile: Profile){
    const index = findIndex(this._profiles, profile2 => profile.id === profile2.id);
    if (index === -1) throw new Error("Profile not found");
    this._profiles[index] = profile;
    this.emit('change');
  }

  removeProfile(id: number){
    if (id === 0){
      throw new Error('You cannot delete the default profile');
    }

    const index = findIndex(this._profiles, profile => profile.id === id);
    if (index === -1){
      throw new Error('Cannot remove profile: does not exist');
    }

    if (id === this.getCurrentProfileId()){
      this.setCurrentProfileId(0);
    }

    this._profiles.splice(index, 1);

    this.emit('change');
  }

  getCurrentProfileId(){
    return this._currentProfileId;
  }

  setCurrentProfileId(id: number){
    this._currentProfileId = id;
    this.emit('change');
  }

  createProfile({name = `Profile ${this.getProfiles().length}`, properties}: {name: string, properties: Properties}){
    const newId = Date.now() + Math.floor(Math.random()*9e10);
    this._profiles.push({
      id: newId,
      name,
      properties: clone(properties),
      isEditing: true,
      editingName: name
    });
    this.setCurrentProfileId(newId);
  }

  handleActions(action: {type: string}){
    switch (action.type) {
      case 'UPDATE_PROFILE':
        this.updateProfile(<Profile> action['profile']);
        break;

      case 'REMOVE_PROFILE':
        this.removeProfile(<number> action['id']);
        break;

      case 'CREATE_PROFILE':
        this.createProfile({name: <string>action['name'], properties: <Properties> action['properties']});
        break;

      case 'OPEN_PROFILE':
        this.setCurrentProfileId(<number> action['id']);
        break;

      case 'IMPORT_DATA_SUCCESS':
        this.fromJSON(<ProfilesStoreAtributesExport> action['data']['profilesStore']);
        break;

    }
  }

  toJSON(){
    return assign(clone(pick(this, ["_profiles", "_currentProfileId"])), {__desqui: true});
  }

  fromJSON(obj: ProfilesStoreAtributesExport){
    console.log('Importing profile form JSON', obj);
    if (obj instanceof Object === false || obj.__desqui !== true){
      throw new Error('Invalid data object');
    }
    assign(this, clone(pick(obj, ["_profiles", "_currentProfileId"])));
  }

}

const storage = localStorage.getItem('profilesStore');
const initialValue = storage ? JSON.parse(storage) : null;
const profilesStore = new ProfilesStore(initialValue);

profilesStore.on('change', () => {
  localStorage.setItem('profilesStore', JSON.stringify(profilesStore.toJSON()));
});

window['profilesStore'] = profilesStore;

dispatcher.register(profilesStore.handleActions.bind(profilesStore));

export default profilesStore;
