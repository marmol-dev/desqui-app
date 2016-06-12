import dispatcher from '../dispatcher';
import Desqui from 'desqui';
import * as fs from 'fs';
import profilesStore, {ProfilesStore} from '../stores/profiles';
import propertiesStore from '../stores/properties';


export function removeProfile(id: number){
  dispatcher.dispatch({
    type: 'REMOVE_PROFILE',
    id
  });
}

export function updateProfile(profile: any){
  dispatcher.dispatch({
    type: 'UPDATE_PROFILE',
    profile
  });
}

export function createProfile({name, properties} : {name?: string, properties: any}){
  dispatcher.dispatch({
    type: 'CREATE_PROFILE',
    name,
    properties
  });
}

export function openProfile(id: number){
  dispatcher.dispatch({
    type: 'OPEN_PROFILE',
    id
  })
}

export function exportData(path: string){
  dispatcher.dispatch({
    type: 'EXPORT_DATA',
    path
  });

  const data = {
    profilesStore: profilesStore.toJSON(),
    propertiesStore: propertiesStore.toJSON()
  }

  fs.writeFile(path, JSON.stringify(data), (error : Error) => {
    if (error){
      dispatcher.dispatch({
        type: 'EXPORT_DATA_ERROR',
        error
      });
    } else {
      dispatcher.dispatch({
        type: 'EXPORT_DATA_SUCCESS'
      });
    }
  })
}

export function importData(path: string){
  dispatcher.dispatch({
    type: 'IMPORT_DATA',
    path
  });

  fs.readFile(path, (error : any, txt: any) => {
    if (error){
      dispatcher.dispatch({
        type: 'IMPORT_DATA_ERROR',
        error
      });
    } else {
      let data: any;

      try {
        data = JSON.parse(txt);
      } catch(e){}

      if (data){
        dispatcher.dispatch({
          type: 'IMPORT_DATA_SUCCESS',
          data
        });
      } else {
        dispatcher.dispatch({
          type: 'IMPORT_DATA_ERROR',
          error: new Error('Invalid JSON')
        })
      }
    }
  })
}
