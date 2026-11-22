// Builds the email the writer gets after submitting, asking them to confirm it was them.

const { renderEmail } = require('./emailTemplate');

function buildConfirmEmail(name, link, options) {
  const subject = 'Please confirm your recommendation for Charles Carreon';
  const text =
    'Hi ' + name + ',\n\n' +
    'Someone (hopefully you) submitted a recommendation for Charles S. Carreon on charlescarreon.dev.\n\n' +
    'To confirm that you wrote it, open this link and press the confirm button:\n' +
    link + '\n\n' +
    'The link works for 48 hours. Until you confirm, nothing is shared with anyone.\n\n' +
    'If you did not write this, ignore this email and the submission will be deleted automatically.\n';
  const html = renderEmail(Object.assign({
    preheader: 'Please confirm that you submitted this recommendation for Charles S. Carreon.',
    heading: 'Please confirm your recommendation',
    intro: [
      'Dear ' + name + ',',
      'A recommendation for Charles S. Carreon was submitted on charlescarreon.dev using this email address. If this was you, please confirm it by pressing the button below.'
    ],
    button: { label: 'Confirm my recommendation', url: link },
    notes: ['This link is valid for 48 hours. Until you confirm, your recommendation is not shared with anyone.'],
    footer: [
      'If you did not submit this recommendation, no action is needed. The submission will be deleted automatically.',
      'You received this email because this address was used to submit a recommendation on charlescarreon.dev.'
    ]
  }, options || {}));
  return { subject: subject, text: text, html: html };
}

module.exports = { buildConfirmEmail };
