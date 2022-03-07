import React from 'react';
import Button from './Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { changeLocale as changeLocaleAction } from 'react-admin';
import PropTypes from 'prop-types';
import ReactCountryFlag from 'react-country-flag';
import { Storage } from '../data/Storage';

const MAPPING = {
  vi: 'vn',
  en: 'us',
};

class LanguageSetting extends React.Component {
  constructor(props) {
    super(props);
    let activeLanguages = ['vi', 'en'];
  /*   if (process.env.NODE_ACTIVE_LANGUAGES) {
      activeLanguages = process.env.NODE_ACTIVE_LANGUAGES.split(',');
    } */
    this.state = {
      anchorEl: null,
      activeLanguages,
    };
  }

  componentDidMount() {
    const { activeLanguages } = this.state;
    if (activeLanguages.length > 1) {
      const { locale, changeLocale } = this.props;
      const userLanguage = Storage.getUserLanguage();
      if (userLanguage.length === 2 && userLanguage !== locale) {
        changeLocale(userLanguage);
      }
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = language => {
    const { changeLocale } = this.props;
    const userLanguage = Storage.getUserLanguage();
    if (userLanguage !== language) {
      Storage.setUserLanguage(language);
      changeLocale(language);
      this.setState({ anchorEl: null }, () => window.location.reload());
    } else {
      this.setState({ anchorEl: null });
    }
  };

  render() {
    const { anchorEl, activeLanguages } = this.state;
    const { locale } = this.props;
    // console.log('activeLanguages', activeLanguages);
    if (activeLanguages.length < 2) return null;
    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : null}
          variant="flat"
          aria-haspopup="true"
          onClick={this.handleClick}
          style={{ color: 'white', padding: 0 }}
          label={''}
        >
          <ReactCountryFlag
            styleProps={{
              width: '24px',
              height: '24px',
            }}
            code={MAPPING[locale] || locale}
            svg
          />
        </Button>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem selected={'vi' === locale} onClick={() => this.handleClose('vi')}>
            <ReactCountryFlag
              styleProps={{
                width: '24px',
                height: '24px',
                marginRight: '16px',
              }}
              code="vn"
              svg
            />
            Tiếng Việt
          </MenuItem>
          <MenuItem selected={'en' === locale} onClick={() => this.handleClose('en')}>
            <ReactCountryFlag
              styleProps={{
                width: '24px',
                height: '24px',
                marginRight: '16px',
              }}
              code="us"
              svg
            />
            English
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

LanguageSetting.propTypes = {
  changeLocale: PropTypes.func,
  locale: PropTypes.string,
};

const mapStateToProp = state => ({
  locale: state.i18n.locale,
});

export default compose(
  connect(mapStateToProp, {
    changeLocale: changeLocaleAction,
  }),
)(LanguageSetting);
