import dispatcher from '../dispatcher';
import Desqui from 'desqui';
import fs from 'fs';
import profilesStore from '../stores/profiles';
import propertiesStore from '../stores/properties';


export function removeProfile(id){
  dispatcher.dispatch({
    type: 'REMOVE_PROFILE',
    id
  });
}

export function updateProfile(profile){
  dispatcher.dispatch({
    type: 'UPDATE_PROFILE',
    profile
  });
}

export function createProfile({name, properties}){
  dispatcher.dispatch({
    type: 'CREATE_PROFILE',
    name,
    properties
  });
}

export function openProfile(id){
  dispatcher.dispatch({
    type: 'OPEN_PROFILE',
    id
  })
}

export function removeProfile(id){
  dispatcher.dispatch({
    type: 'REMOVE_PROFILE',
    id
  })
}

export function exportData(path){
  dispatcher.dispatch({
    type: 'EXPORT_DATA',
    path
  });

  const data = {
    profilesStore: profilesStore.toJSON(),
    propertiesStore: propertiesStore.toJSON()
  }

  fs.writeFile(path, JSON.stringify(data), error => {
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

export function importData(path){
  dispatcher.dispatch({
    type: 'IMPORT_DATA',
    path
  });

  fs.readFile(path, (error, txt) => {
    if (error){
      dispatcher.dispatch({
        type: 'IMPORT_DATA_ERROR',
        error
      });
    } else {
      let data;

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
