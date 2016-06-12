import * as React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin = require('react-tap-event-plugin');
import App from './components/app.tsx';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(<App/>, document.getElementById('root'));
