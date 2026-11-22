// The look of the emails the site sends: clean and professional, with the website's light
// look (the same teal accent, rounded pill button, plain sans-serif type and soft grey
// panels) kept simple enough for email. One shared template, so every email matches.
//
// Built for the widest support (Gmail, Outlook desktop and web, Apple Mail, Yahoo, mobile
// apps): table layout, inline styles only, web-safe fonts, no images, no scripts, no
// CSS the big clients ignore. There is no dark-mode code on purpose: each app shows the
// email in its own default light or dark way. Every colour is set explicitly (page, card,
// text) so an app that darkens the email itself still has a readable result.
// The plain-text body is always sent beside this HTML (see mail.js) and shows the full
// link, so nothing depends on the button or the styling.

const { esc } = require('./html');

// System sans-serif, like the website. Each app uses the first one it has.
const SANS = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// The website's light theme colours.
const INK = '#0f1115';      // headings and the name
const TEXT = '#2b3342';     // body text
const MUTED = '#5f6877';    // labels and small print
const LINE = '#dde1e7';     // hairlines and borders
const PAGE = '#f7f8fa';     // the area around the card
const PANEL = '#f0f2f5';    // the quoted recommendation
const ACCENT = '#0e7a70';   // teal: the top bar, the button and the quote rule

function multiline(text) {
  return esc(text).replace(/\r?\n/g, '<br>');
}

function linkHtml(url) {
  return '<a href="' + esc(url) + '" style="color:' + ACCENT + ';text-decoration:underline">' + esc(url) + '</a>';
}

// "Public" or "Private" after a profile link, in plain small capitals (no pills: they
// need CSS some apps drop).
function visibilityTag(isPublic) {
  return ' <span style="font-family:' + SANS + ';font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:' +
    (isPublic ? ACCENT : MUTED) + '">' + (isPublic ? 'Public' : 'Private') + '</span>';
}

// Rows for the details table: [label, htmlValue].
function detailsTable(rows) {
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;border-top:1px solid ' + LINE + '">' +
    rows.map(function (r) {
      return '<tr>' +
        '<td valign="top" width="120" style="padding:9px 12px 9px 0;border-bottom:1px solid ' + LINE + ';font-family:' + SANS + ';font-size:13px;line-height:20px;color:' + MUTED + '">' + esc(r[0]) + '</td>' +
        '<td valign="top" style="padding:9px 0;border-bottom:1px solid ' + LINE + ';font-family:' + SANS + ';font-size:14px;line-height:20px;color:' + TEXT + '">' + r[1] + '</td>' +
        '</tr>';
    }).join('') +
    '</table>';
}

// options:
//   preheader  short line some apps show beside the subject
//   heading    the title line
//   intro      paragraphs of plain text (array of strings)
//   quote      { text, by } the recommendation, set apart in a panel
//   details    [[label, htmlValue]] rows
//   button     { label, url }
//   notes      small plain-text lines under the button (array)
//   footer     small plain-text lines at the very bottom (array)
function renderEmail(options) {
  const o = options || {};
  const para = function (text) {
    return '<p style="margin:0 0 16px;font-family:' + SANS + ';font-size:15px;line-height:24px;color:' + TEXT + '">' + esc(text) + '</p>';
  };
  const small = function (text) {
    return '<p style="margin:0 0 8px;font-family:' + SANS + ';font-size:12px;line-height:19px;color:' + MUTED + '">' + esc(text) + '</p>';
  };

  const quote = o.quote
    ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0"><tr>' +
      '<td width="4" bgcolor="' + ACCENT + '" style="width:4px;background-color:' + ACCENT + ';font-size:0;line-height:0">&nbsp;</td>' +
      '<td bgcolor="' + PANEL + '" style="padding:16px 18px;background-color:' + PANEL + '">' +
      '<p style="margin:0;font-family:' + SANS + ';font-size:16px;line-height:26px;color:' + INK + '">' + multiline(o.quote.text) + '</p>' +
      (o.quote.by ? '<p style="margin:12px 0 0;font-family:' + SANS + ';font-size:13px;line-height:20px;color:' + MUTED + '">' + esc(o.quote.by) + '</p>' : '') +
      '</td></tr></table>'
    : '';

  // The padding sits on the cell, not on the link: Outlook ignores padding on links.
  const button = o.button
    ? '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 6px"><tr>' +
      '<td bgcolor="' + ACCENT + '" align="center" style="background-color:' + ACCENT + ';padding:13px 30px;border-radius:999px">' +
      '<a href="' + esc(o.button.url) + '" style="font-family:' + SANS + ';font-size:15px;font-weight:bold;line-height:20px;color:#ffffff;text-decoration:none;display:inline-block">' +
      esc(o.button.label) + '</a></td></tr></table>' +
      '<p style="margin:12px 0 0;font-family:' + SANS + ';font-size:12px;line-height:19px;color:' + MUTED + '">If the button does not work, copy this link into your browser:<br>' +
      '<span style="word-break:break-all">' + linkHtml(o.button.url) + '</span></p>'
    : '';

  return '<!DOCTYPE html>\n' +
    '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>\n' +
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<meta name="x-apple-disable-message-reformatting">\n' +
    '<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->\n' +
    '<title>' + esc(o.heading || 'Charles S. Carreon') + '</title>\n' +
    '</head>\n' +
    '<body style="margin:0;padding:0;background-color:' + PAGE + '">\n' +
    (o.preheader
      ? '<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:' + PAGE + '">' + esc(o.preheader) + '</div>\n'
      : '') +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + PAGE + '" style="background-color:' + PAGE + '">' +
    '<tr><td align="center" style="padding:28px 12px">' +
    '<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">' +
    // top bar and name
    '<tr><td bgcolor="' + ACCENT + '" height="4" style="background-color:' + ACCENT + ';height:4px;font-size:0;line-height:0">&nbsp;</td></tr>' +
    '<tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:22px 28px 0;border-left:1px solid ' + LINE + ';border-right:1px solid ' + LINE + '">' +
    '<span style="font-family:' + SANS + ';font-size:18px;line-height:24px;font-weight:bold;color:' + INK + '">Charles S. Carreon</span>' +
    '<span style="font-family:' + SANS + ';font-size:12px;line-height:24px;letter-spacing:1px;text-transform:uppercase;color:' + MUTED + '">&nbsp;&nbsp;&middot;&nbsp;&nbsp;Recommendations</span>' +
    '</td></tr>' +
    // letter
    '<tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:22px 28px 26px;border-left:1px solid ' + LINE + ';border-right:1px solid ' + LINE + '">' +
    '<h1 style="margin:0 0 18px;font-family:' + SANS + ';font-size:24px;line-height:32px;font-weight:bold;color:' + INK + '">' + esc(o.heading || '') + '</h1>' +
    (o.intro || []).map(para).join('') +
    quote +
    (o.details ? detailsTable(o.details) : '') +
    button +
    '</td></tr>' +
    ((o.notes && o.notes.length)
      ? '<tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:16px 28px 10px;border:1px solid ' + LINE + ';border-top:1px solid ' + LINE + '">' + o.notes.map(small).join('') + '</td></tr>'
      : '<tr><td style="font-size:0;line-height:0;border-top:1px solid ' + LINE + '">&nbsp;</td></tr>') +
    // footer
    '<tr><td style="padding:18px 6px 0">' +
    (o.footer || []).map(small).join('') +
    '<p style="margin:0;font-family:' + SANS + ';font-size:12px;line-height:19px;color:' + MUTED + '">Charles S. Carreon &middot; charlescarreon.dev</p>' +
    '</td></tr>' +
    '</table>' +
    '<!--[if mso]></td></tr></table><![endif]-->' +
    '</td></tr></table>\n' +
    '</body></html>\n';
}

module.exports = { renderEmail, visibilityTag, linkHtml };
