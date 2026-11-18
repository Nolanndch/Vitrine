import { rates, localised, translate, formatMoney, getQuote, quoteDelay, contactURL } from './pricing.js';
const select = document.getElementById('projectType');
const options = document.getElementById('quoteOptions');
const params = new URLSearchParams(location.search);
const initialType = params.get('type');
select.value = Object.hasOwn(rates, initialType) ? initialType : 'shopify';
let selected = (params.get('options') || '').split(',');
function update() {
  const quote = getQuote(select.value, selected);
  document.getElementById('quoteTotal').textContent = formatMoney(quote.total);
  document.getElementById('quoteDelay').textContent = translate('Délai indicatif : ', 'Typical timeline: ') + quoteDelay(quote);
  document.getElementById('quoteContact').href = contactURL(quote);
  const url = new URL(location.href);
  url.searchParams.set('type', quote.type);
  if (quote.options.length) url.searchParams.set('options', quote.options.map(option => option.id).join(','));
  else url.searchParams.delete('options');
  history.replaceState(null, '', url);
  document.querySelectorAll('a[hreflang]').forEach(link => { link.href = link.href.split(/[?#]/)[0] + url.search + url.hash; });
}
function renderOptions() {
  const rate = rates[select.value];
  selected = selected.filter(id => rate.options.some(option => option.id === id));
  options.replaceChildren();
  if (rate.options.length) {
    const legend = document.createElement('p'); legend.className = 'g-options-title'; legend.textContent = translate('Options à ajouter', 'Optional extras'); options.append(legend);
    rate.options.forEach(option => {
      const label = document.createElement('label'); label.className = 'g-option';
      const input = document.createElement('input'); input.type = 'checkbox'; input.value = option.id; input.checked = selected.includes(option.id);
      const name = document.createElement('span'); name.textContent = localised(option.name);
      const price = document.createElement('strong'); price.textContent = '+ ' + formatMoney(option.price);
      label.append(input, name, price); options.append(label);
    });
  }
  document.getElementById('quoteIncluded').textContent = localised(rate.included);
  document.getElementById('quoteExternal').textContent = localised(rate.external);
  update();
}
select.addEventListener('change', () => { selected = []; renderOptions(); });
options.addEventListener('change', () => { selected = [...options.querySelectorAll('input:checked')].map(input => input.value); update(); });
window.addEventListener('pageshow', () => { selected = [...options.querySelectorAll('input:checked')].map(input => input.value); renderOptions(); });
renderOptions();
