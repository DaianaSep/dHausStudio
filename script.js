const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('form')?.addEventListener('submit', event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = '¡Gracias! Te contactamos pronto.';
  button.disabled = true;
});

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const calculator = document.querySelector('.calculator');

function updateEstimate() {
  if (!calculator) return;
  const selectedProperty = calculator.querySelector('input[name="property"]:checked');
  const checkedServices = [...calculator.querySelectorAll('input[name="service"]:checked')];
  const keyService = calculator.querySelector('input[name="key"]:checked');
  const zone = document.querySelector('#zone');
  const choices = [selectedProperty, ...checkedServices, keyService].filter(Boolean).map(input => ({
    label: input.dataset.label,
    price: Number(input.dataset.price)
  }));
  choices.push({ label: zone.options[zone.selectedIndex].dataset.label, price: Number(zone.value) });
  const total = choices.reduce((sum, choice) => sum + choice.price, 0);
  document.querySelector('#estimate-total').textContent = money.format(total);
  document.querySelector('#estimate-items').innerHTML = choices
    .filter(choice => choice.price > 0 || choice.label === 'Fotografía HDR')
    .map(choice => `<li>${choice.label}<span>${choice.price === 0 ? 'Incluido' : `+ ${money.format(choice.price)}`}</span></li>`).join('');
  const summary = choices.filter(choice => choice.price > 0 || choice.label === 'Fotografía HDR')
    .map(choice => choice.label).join(', ');
  document.querySelector('#quote-link').dataset.summary = `Estimación: ${money.format(total)} — ${summary}`;
}

calculator?.addEventListener('change', updateEstimate);
document.querySelector('#quote-link')?.addEventListener('click', event => {
  const message = document.querySelector('textarea[name="proyecto"]');
  if (message && !message.value) message.value = event.currentTarget.dataset.summary || '';
});
updateEstimate();
