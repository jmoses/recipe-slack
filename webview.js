'use strict';

var _electron = require('electron');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTeamIcon = function getTeamIcon(count = 0) {
  let countTeamIconCheck = count;
  let bgUrl = null;

  const teamMenu = document.querySelector('#team_menu');
  if (teamMenu) {
    teamMenu.click();

    const icon = document.querySelector('.team_icon');
    if (icon) {
      bgUrl = window.getComputedStyle(icon, null).getPropertyValue('background-image');
      bgUrl = /^url\((['"]?)(.*)\1\)$/.exec(bgUrl);
      bgUrl = bgUrl ? bgUrl[2] : '';
    }

    setTimeout(() => {
      document.querySelector('.team_menu').remove();
      document.querySelector('#msg_input .ql-editor').focus();
    }, 10);
  }

  countTeamIconCheck += 1;

  if (bgUrl) {
    _electron.ipcRenderer.sendToHost('avatar', bgUrl);
  } else if (countTeamIconCheck <= 5) {
    setTimeout(() => {
      getTeamIcon(countTeamIconCheck + 1);
    }, 2000);
  }
};

module.exports = Franz => {
  const getMessages = () => {
    const directMessages = document.querySelectorAll('.p-channel_sidebar__badge').length;
    const allMessages = document.querySelectorAll('.p-channel_sidebar__channel--unread:not([class*="p-channel_sidebar__channel--muted"])').length - directMessages;

    // set Franz badge
    Franz.setBadge(directMessages, allMessages);
  };
  Franz.loop(getMessages);

  // remove the slack redirection host from external urls,
  // like the native Slack.app does.
  const replaceUrls = () => {
    var links = document.querySelectorAll('a[href^="https://slack-redir"]'),
        i = links.length;

    while(i--) {
      var link = links[i];
      link.role = '_link';
      link.href = decodeURIComponent(link.href.split("=")[1]);
      link.parentNode.replaceChild(link.cloneNode(true), link)
    }
    
  };
  Franz.loop(replaceUrls);

  setTimeout(() => {
    getTeamIcon();
  }, 4000);

  // inject franz.css stylesheet
  Franz.injectCSS(_path2.default.join(__dirname, 'service.css'));
};
