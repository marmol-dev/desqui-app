import React, {Component, PropTypes} from 'react';
import {AppBar} from 'material-ui';

export default class Header extends Component {
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
