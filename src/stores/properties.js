import Dispatcher from '../dispatcher';
import {EventEmitter} from 'events';
import {index} from '../utils';
import pick from 'object.pick';
import profilesStore from './profiles';
import clone from 'clone';

class PropertiesStore extends EventEmitter {
  static getDefaultValue(){
    return {
      _properties : profilesStore.getProfile(0).properties,
      _isDownloading : false,
      _result : null
    };
  }


  constructor(initialValue){
    super();

    if (initialValue){
      this.fromJSON(initialValue);
    } else {
      Object.assign(this, PropertiesStore.getDefaultValue());
    }
  }

  isDownloading(){
    return this._isDownloading;
  }

  setDownloading(){
    this._isDownloading = true;
    this.emit('change');
  }

  clearDownloading(){
    this._isDownloading = false;
    this.emit('change');
  }

  getProperties(){
    return clone(this._properties);
  }

  set(name, value){
    this._properties[name] = value;
    this.emit('change');
  }

  setProperties(props){
    this._properties = props;
    this.emit('change');
  }

  setResult(result){
    this._result = result;
    this.emit('change');
  }

  getResult(){
    return this._result;
  }

  clearProperties(){
    Object.assign(this, PropertiesStore.getDefaultValue());
    this.emit('change');
  }

  handleActions(action){
    switch(action.type){
      case 'PROPERTY_CHANGE': {
        this.set(action.propertyName, action.propertyValue);
        break;
      }
      case 'DOWNLOAD_PAGE':
        this.setDownloading();
        break;

      case 'RECEIVED_DOWNLOAD_RESULT':
        this.clearDownloading();
        this.setResult(action.result);
        break;

      case 'CLEAR_PROPERTIES':
        this.clearProperties();
        break;

      case 'CLEAR_RESULT':
        this.setResult(null);
        break;

      case 'IMPORT_DATA_SUCCESS':
        this.fromJSON(action.data.propertiesStore);
        break;
    }
  }

  toJSON(){
    return Object.assign(clone(pick(this, ['_properties', '_isDownloading', '_result'])), {__desqui: true});
  }

  fromJSON(obj){
    console.log('Importing props form JSON', obj);

    if (obj instanceof Object === false || obj.__desqui !== true){
      throw new Error('Invalid data object');
    }
    Object.assign(this, clone(pick(obj, ['_properties', '_isDownloading', '_result'])));
    this.emit('change');
  }
}

const storage = localStorage.getItem('propertiesStore');
const initialValue = storage ? JSON.parse(storage) : null;
const propertiesStore = new PropertiesStore(initialValue);

window.propertiesStore = propertiesStore;

propertiesStore.on('change', () => {
  localStorage.setItem('propertiesStore', JSON.stringify(propertiesStore.toJSON()));
});

profilesStore.on('change', () => {
  propertiesStore.setProperties(
    profilesStore.getProfile(profilesStore.getCurrentProfileId()).properties
  );
});

Dispatcher.register(propertiesStore.handleActions.bind(propertiesStore));

export default propertiesStore;
