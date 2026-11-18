import { rates, localised, translate, formatMoney, getQuote, quoteDelay } from './pricing.js';
const form = document.getElementById('contactForm');
const params = new URLSearchParams(location.search);
const type = params.get('besoin');
const service = document.getElementById('contactService');
if ([...service.options].some(option => option.value === type)) service.value = type;
if (params.get('estimation') === '1' && Object.hasOwn(rates, type)) {
  const quote = getQuote(type, (params.get('options') || '').split(','));
  const name = localised(quote.rate.name);
  const options = quote.options.map(option => localised(option.name)).join(', ') || translate('Aucune option', 'No extras');
  const summary = `${name} · ${formatMoney(quote.total)} · ${quoteDelay(quote)}`;
  document.getElementById('quoteNoticeText').textContent = summary + ' · ' + options;
  document.getElementById('quoteNotice').hidden = false;
  document.getElementById('contactMessage').value = translate(`Bonjour Nolann,\n\nVoici l’estimation de mon projet :\n${summary}\nOptions : ${options}\n\nJ’aimerais en discuter avec vous.`, `Hi Nolann,\n\nHere is my project estimate:\n${summary}\nExtras: ${options}\n\nI’d like to discuss it with you.`);
}
document.getElementById('copyEmailBtn').addEventListener('click', async () => {
  const email = 'nolann.duchaussoy.pro@gmail.com';
  try { await navigator.clipboard.writeText(email); document.getElementById('copyStatus').textContent = translate('Adresse email copiée.', 'Email address copied.'); }
  catch (_) { document.getElementById('copyStatus').textContent = email; }
});
function messageData() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const label = service.options[service.selectedIndex].textContent;
  const message = document.getElementById('contactMessage').value.trim();
  return {
    subject: translate(`Demande de projet — ${name} (Takuzo)`, `Project request — ${name} (Takuzo)`),
    body: translate(`Nom / Marque : ${name}\nEmail : ${email}\nPrestation : ${label}\n\nMessage :\n${message}`, `Name / Brand: ${name}\nEmail: ${email}\nService: ${label}\n\nMessage:\n${message}`)
  };
}
form.addEventListener('submit', event => {
  event.preventDefault(); if (!form.reportValidity()) return;
  const { subject, body } = messageData(); document.getElementById('contactSuccess').hidden = false;
  location.href = 'mailto:nolann.duchaussoy.pro@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});
document.getElementById('gmailWebLink').addEventListener('click', () => {
  if (!form.reportValidity()) return;
  const { subject, body } = messageData();
  const query = new URLSearchParams({ view: 'cm', fs: '1', to: 'nolann.duchaussoy.pro@gmail.com', su: subject, body });
  window.open('https://mail.google.com/mail/?' + query, '_blank', 'noopener,noreferrer');
});
// With scripts unavailable, keep the direct email link rather than submitting personal data to this static host.
form.hidden = false;
