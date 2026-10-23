const eventForm = document.querySelector('#event-form');
const eventFields = document.querySelector('#event-fields');
const createButton = document.querySelector('#create-button');
const refreshButton = document.querySelector('#refresh-button');
const eventList = document.querySelector('#event-list');
const listStatus = document.querySelector('#list-status');
const registrationDialog = document.querySelector('#registration-dialog');
const registrationForm = document.querySelector('#registration-form');
const registrationFields = document.querySelector('#registration-fields');
const registerButton = document.querySelector('#register-button');
const closeDialog = document.querySelector('#close-dialog');
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' });
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
let selectedEventId = null;

function showMessage(selector, message, isError = false) {
  const element = document.querySelector(selector);
  element.textContent = message;
  element.classList.toggle('error', isError);
  element.hidden = !message;
}

async function requestJson(url, body) {
  let response;

  try {
    response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.');
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Não foi possível concluir a operação.');
    error.status = response.status;
    throw error;
  }

  return data;
}

function openRegistration(event) {
  selectedEventId = event.id;
  registrationForm.reset();
  showMessage('#registration-message', '');
  document.querySelector('#registration-event').textContent = event.title;
  registrationDialog.showModal();
  document.querySelector('#participant-name').focus();
}

function renderEvents(events) {
  eventList.replaceChildren();
  let totalRegistrations = 0;
  let totalAvailable = 0;

  for (const event of events) {
    const registrations = Number(event.registrationCount);
    const available = Math.max(0, event.capacity - registrations);
    const date = new Date(event.date);
    const card = document.querySelector('#event-template').content.cloneNode(true);
    totalRegistrations += registrations;
    totalAvailable += available;

    card.querySelector('.event-title').textContent = event.title;
    card.querySelector('.event-month').textContent = monthFormatter.format(date).replace('.', '');
    card.querySelector('.event-day').textContent = date.getDate();
    card.querySelector('.event-date').textContent = dateFormatter.format(date);
    card.querySelector('.event-date').dateTime = event.date;
    card.querySelector('.event-badge').textContent = available ? 'Inscrições abertas' : 'Lotado';
    card.querySelector('.event-badge').classList.toggle('full', !available);
    card.querySelector('.event-registrations').textContent = `${registrations} de ${event.capacity} vagas preenchidas`;
    card.querySelector('.event-remaining').textContent = `${available} ${available === 1 ? 'vaga disponível' : 'vagas disponíveis'}`;
    const progress = card.querySelector('.capacity-progress');
    progress.max = event.capacity;
    progress.value = registrations;
    progress.setAttribute('aria-label', `Ocupação de ${event.title}`);
    const button = card.querySelector('.register-button');
    button.disabled = !available;
    button.setAttribute('aria-label', `Inscrever participante em ${event.title}`);
    if (!available) button.textContent = 'Evento lotado';
    button.addEventListener('click', () => openRegistration(event));
    eventList.append(card);
  }

  document.querySelector('#event-count').textContent = events.length;
  document.querySelector('#registration-count').textContent = totalRegistrations;
  document.querySelector('#available-count').textContent = totalAvailable;
  document.querySelector('#empty-state').hidden = events.length > 0;
}

async function loadEvents() {
  refreshButton.disabled = true;
  listStatus.hidden = false;
  listStatus.textContent = 'Atualizando eventos…';

  try {
    const events = await requestJson('/events');
    renderEvents(events);
    listStatus.hidden = true;
  } catch (error) {
    listStatus.textContent = `${error.message} Use o botão Atualizar para tentar novamente.`;
  } finally {
    refreshButton.disabled = false;
  }
}

eventForm.addEventListener('submit', async (submitEvent) => {
  submitEvent.preventDefault();
  const fields = new FormData(eventForm);
  const title = fields.get('title').trim();
  const date = new Date(fields.get('date'));
  const capacity = Number(fields.get('capacity'));

  if (!title || Number.isNaN(date.getTime()) || !Number.isSafeInteger(capacity) || capacity < 1) {
    showMessage('#event-message', 'Informe um nome, uma data válida e um número inteiro positivo de vagas.', true);
    return;
  }

  eventFields.disabled = true;
  createButton.textContent = 'Criando evento…';
  showMessage('#event-message', '');
  showMessage('#page-message', '');

  try {
    await requestJson('/events', { title, date: date.toISOString(), capacity });
    eventForm.reset();
    showMessage('#event-message', 'Evento criado! As inscrições já estão abertas.');
    await loadEvents();
  } catch (error) {
    showMessage('#event-message', error.message, true);
  } finally {
    eventFields.disabled = false;
    createButton.textContent = 'Criar evento ↗';
  }
});

registrationForm.addEventListener('submit', async (submitEvent) => {
  submitEvent.preventDefault();
  const fields = new FormData(registrationForm);
  const participantName = fields.get('participantName').trim();
  const email = fields.get('email').trim();

  if (!participantName) {
    showMessage('#registration-message', 'Informe o nome do participante.', true);
    return;
  }

  registrationFields.disabled = true;
  closeDialog.disabled = true;
  registerButton.textContent = 'Confirmando…';
  showMessage('#registration-message', '');

  try {
    await requestJson(`/events/${selectedEventId}/register`, { participantName, email });
    registrationDialog.close();
    showMessage('#page-message', `Inscrição de ${participantName} confirmada com sucesso!`);
    await loadEvents();
  } catch (error) {
    showMessage('#registration-message', error.message, true);
    if (error.status === 403 || error.status === 404) await loadEvents();
  } finally {
    registrationFields.disabled = false;
    closeDialog.disabled = false;
    registerButton.textContent = 'Confirmar inscrição';
  }
});

registrationDialog.addEventListener('cancel', (cancelEvent) => {
  if (registrationFields.disabled) cancelEvent.preventDefault();
});

closeDialog.addEventListener('click', () => registrationDialog.close());
refreshButton.addEventListener('click', loadEvents);
loadEvents();
