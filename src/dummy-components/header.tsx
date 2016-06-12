import * as React from 'react';
const {Component, PropTypes} = React;
import {AppBar} from 'material-ui';

interface HeaderProps {
  title: string,
  handleOpenMenu: () => void
}

export default class Header extends Component<HeaderProps, {}> {
  static propTypes = {
      title: PropTypes.string,
      handleOpenMenu: PropTypes.func
  }

  static styles = {
    AppBar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right:0
    }
  }

  render(){
    return (
      <AppBar style={Header.styles.AppBar} onLeftIconButtonTouchTap={this.props.handleOpenMenu}	 title={this.props.title} />
    );
  }
};
