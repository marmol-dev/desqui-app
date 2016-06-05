import dispatcher from '../dispatcher';
import {EventEmitter} from 'events';
import pick from 'object.pick';
import clone from 'clone';

export class ProfilesStore extends EventEmitter {
  static getDefaultValue(){
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

  constructor(initialValue){
    super();
    if (initialValue){
      this.fromJSON(initialValue);
    } else {
      Object.assign(this, ProfilesStore.getDefaultValue());
    }
  }

  getProfile(id){
    return clone(this._profiles.find(profile => profile.id === id));
  }

  getProfiles(){
    return this._profiles;
  }

  updateProfile(profile){
    console.log(profile);
    const index = this._profiles.findIndex(profile2 => profile.id === profile2.id);
    if (index === -1) throw new Error("Profile not found");
    this._profiles[index] = profile;
    this.emit('change');
  }

  removeProfile(id){
    if (id === 0){
      throw new Error('You cannot delete the default profile');
    }

    const index = this._profiles.findIndex(profile => profile.id === id);
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

  setCurrentProfileId(id){
    this._currentProfileId = id;
    this.emit('change');
  }

  createProfile({name = `Profile ${this.getProfiles().length}`, properties}){
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

  handleActions(action){
    switch (action.type) {
      case 'UPDATE_PROFILE':
        this.updateProfile(action.profile);
        break;

      case 'REMOVE_PROFILE':
        this.removeProfile(action.id);
        break;

      case 'CREATE_PROFILE':
        this.createProfile({name: action.name, properties: action.properties});
        break;

      case 'OPEN_PROFILE':
        this.setCurrentProfileId(action.id);
        break;

      case 'IMPORT_DATA_SUCCESS':
        this.fromJSON(action.data.profilesStore);
        break;

    }
  }

  toJSON(){
    return Object.assign(clone(pick(this, ["_profiles", "_currentProfileId"])), {__desqui: true});
  }

  fromJSON(obj){
    console.log('Importing profile form JSON', obj);
    if (obj instanceof Object === false || obj.__desqui !== true){
      throw new Error('Invalid data object');
    }
    Object.assign(this, clone(pick(obj, ["_profiles", "_currentProfileId"])));
  }

}

const storage = localStorage.getItem('profilesStore');
const initialValue = storage ? JSON.parse(storage) : null;
const profilesStore = new ProfilesStore(initialValue);

profilesStore.on('change', () => {
  localStorage.setItem('profilesStore', JSON.stringify(profilesStore.toJSON()));
});

window.profilesStore = profilesStore;

dispatcher.register(profilesStore.handleActions.bind(profilesStore));

export default profilesStore;
