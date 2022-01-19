import logo from './assets/logo.svg';
import headerLogo from './assets/header-logo.svg';

export const APP_LOGO = logo;
export const HEADER_LOGO = headerLogo;
export const LOGIN_EXPIRES_SECONDS = 1209600; // 14 days

export const ITEM_VIEW = 'ITEM_VIEW';

export const APP_TITLE = process.env.REACT_APP_TITLE;
export const VIDISPINE_URL =
  process.env.REACT_APP_VIDISPINE_URL === '' ? undefined : process.env.REACT_APP_VIDISPINE_URL;

document.title = process.env.REACT_APP_DOCUMENT_TITLE;

/*
Sets the basename for the router so that all paths are relative
https://reactrouter.com/web/api/BrowserRouter/basename-string
*/
let publicUrl = process.env.PUBLIC_URL === '' ? '/' : process.env.PUBLIC_URL;
if (publicUrl && publicUrl.startsWith('http')) {
  publicUrl = new URL(publicUrl);
  publicUrl = publicUrl.pathname.replace(/(.+?)\/+$/, '$1');
}

export const APP_BASENAME = publicUrl;
