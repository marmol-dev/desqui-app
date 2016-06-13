import dispatcher from '../dispatcher';
import Desqui from 'desqui';
import propertiesStore, {Result} from '../stores/properties';
import * as clone from 'clone';
import * as path from 'path';

export function changeProperty(name: string, value: any){
  dispatcher.dispatch({
    type: 'PROPERTY_CHANGE',
    propertyName: name,
    propertyValue: value
  });
}

export function downloadPage(){
  dispatcher.dispatch({
    type: 'DOWNLOAD_PAGE'
  });

  const options = clone(propertiesStore.getProperties());
  const currentDateFormated = (new Date()).toLocaleString().replace(/\//g, '-').replace(/ /,'.');
  const randomNumber = Math.floor(Math.random()*9e9);
  const sufixDir = `${currentDateFormated}.${randomNumber}`;

  options.directory = path.join(options.directory, sufixDir);

  Desqui.createDocument(options).then(
    dir => {
      showDownloadResult({
        data: {dir},
        error: null
      });
    },
    error => {
      console.error(error.stack);
      showDownloadResult({
        data: null,
        error: {message: error.message}
      });
    }
  )
}

export function showDownloadResult(result: Result){
  dispatcher.dispatch({
    type: 'RECEIVED_DOWNLOAD_RESULT',
    result
  });
}

export function clearProperties(){
  dispatcher.dispatch({
    type: 'CLEAR_PROPERTIES'
  });
}

export function clearResult(){
  dispatcher.dispatch({
    type: 'CLEAR_RESULT'
  });
}
