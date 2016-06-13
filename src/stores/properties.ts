import Dispatcher from '../dispatcher';
import {EventEmitter} from 'events';
import pick = require('object.pick');
import {default as profilesStore, Properties} from './profiles';
import clone = require('clone');
import assign = require('object-assign');

export interface Result {
    data?: {
      dir: string
    },
    error?: {
      message: string
    }
}

export interface PropertiesStoreAtributes {
  _properties: Properties,
  _isDownloading: boolean,
  _result?: Result
}

export interface PropertiesStoreAtributesExport extends PropertiesStoreAtributes {
  __desqui: boolean
}

export class PropertiesStore extends EventEmitter {
  private _properties: Properties;
  private _isDownloading: boolean;
  private _result: Result;

  static getDefaultValue() : PropertiesStoreAtributes {
    return {
      _properties : profilesStore.getProfile(0).properties,
      _isDownloading : false,
      _result : null
    };
  }


  constructor(initialValue: PropertiesStoreAtributesExport){
    super();

    if (initialValue){
      this.fromJSON(initialValue);
    } else {
      assign(this, PropertiesStore.getDefaultValue());
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

  set(name: string, value: any){
    (<any>this._properties)[name] = value;
    this.emit('change');
  }

  setProperties(props: Properties){
    this._properties = props;
    this.emit('change');
  }

  setResult(result: Result){
    this._result = result;
    this.emit('change');
  }

  getResult(){
    return this._result;
  }

  clearProperties(){
    assign(this, PropertiesStore.getDefaultValue());
    this.emit('change');
  }

  handleActions(action: {type: string}){
    switch(action.type){
      case 'PROPERTY_CHANGE': {
        this.set(<string> (<any>action)['propertyName'],<any> (<any>action)['propertyValue']);
        break;
      }
      case 'DOWNLOAD_PAGE':
        this.setDownloading();
        break;

      case 'RECEIVED_DOWNLOAD_RESULT':
        this.clearDownloading();
        this.setResult(<Result> (<any>action)['result']);
        break;

      case 'CLEAR_PROPERTIES':
        this.clearProperties();
        break;

      case 'CLEAR_RESULT':
        this.setResult(null);
        break;

      case 'IMPORT_DATA_SUCCESS':
        this.fromJSON(<PropertiesStoreAtributesExport> (<any>action)['data']['propertiesStore']);
        break;
    }
  }

  toJSON(): PropertiesStoreAtributesExport {
    return assign(clone(pick(this, ['_properties', '_isDownloading', '_result'])), {__desqui: true});
  }

  fromJSON(obj: PropertiesStoreAtributesExport){
    console.log('Importing props form JSON', obj);

    if (obj instanceof Object === false || obj.__desqui !== true){
      throw new Error('Invalid data object');
    }
    assign(this, clone(pick(obj, ['_properties', '_isDownloading', '_result'])));
    this.emit('change');
  }
}

const storage = localStorage.getItem('propertiesStore');
const initialValue = storage ? JSON.parse(storage) : null;
const propertiesStore = new PropertiesStore(initialValue);

(<any>window)['propertiesStore'] = propertiesStore;

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
