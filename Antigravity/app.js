// NexusAutomation Client Application Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive ROI Calculator Logic
  const teamSizeInput = document.getElementById('teamSize');
  const manualHoursInput = document.getElementById('manualHours');
  const hourlyRateInput = document.getElementById('hourlyRate');
  
  const teamSizeVal = document.getElementById('teamSizeVal');
  const manualHoursVal = document.getElementById('manualHoursVal');
  const hourlyRateVal = document.getElementById('hourlyRateVal');
  
  const roiTotalSavings = document.getElementById('roiTotalSavings');
  const roiHoursSaved = document.getElementById('roiHoursSaved');
  const roiEfficiency = document.getElementById('roiEfficiency');

  function calculateROI() {
    const team = parseInt(teamSizeInput.value, 10);
    const hours = parseInt(manualHoursInput.value, 10);
    const rate = parseInt(hourlyRateInput.value, 10);

    teamSizeVal.textContent = team;
    manualHoursVal.textContent = hours + ' hrs/semana';
    hourlyRateVal.textContent = '$' + rate + ' USD/h';

    // 52 weeks per year. Automation typically reduces manual overhead by ~75%
    const totalAnnualManualHours = team * hours * 52;
    const hoursSaved = Math.round(totalAnnualManualHours * 0.75);
    const annualSavings = Math.round(hoursSaved * rate);

    roiTotalSavings.textContent = '$' + annualSavings.toLocaleString() + ' USD';
    roiHoursSaved.textContent = hoursSaved.toLocaleString() + ' horas';
    roiEfficiency.textContent = '75% automatizado';
  }

  if (teamSizeInput && manualHoursInput && hourlyRateInput) {
    teamSizeInput.addEventListener('input', calculateROI);
    manualHoursInput.addEventListener('input', calculateROI);
    hourlyRateInput.addEventListener('input', calculateROI);
    calculateROI();
  }

  // 2. Conversational assistant backed by the site's server-side knowledge.
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const quickButtons = document.querySelectorAll('.quick-btn');
  const resetChat = document.getElementById('resetChat');
  const chatStatus = document.getElementById('chatStatus');
  const chatError = document.getElementById('chatError');
  const retryChat = document.getElementById('retryChat');
  const history = [];
  let busy = false;
  let failedQuestion = null;

  function appendMessage(sender, text) {
    const node = document.createElement('div');
    node.className = `chat-msg msg-${sender}`;
    node.textContent = text;
    chatBody.appendChild(node);
    chatBody.scrollTop = chatBody.scrollHeight;
    return node;
  }

  function setBusy(value) {
    busy = value;
    btnSend.disabled = value;
    chatInput.disabled = value;
    resetChat.disabled = value;
    quickButtons.forEach(btn => { btn.disabled = value; });
    chatBody.setAttribute('aria-busy', String(value));
    chatStatus.textContent = value ? 'Consultando la información del sitio…' : 'Basado en el contenido de esta página';
  }

  async function handleUserMessage(text, retry = false) {
    const question = text?.trim();
    if (busy || !question) return;
    if (question.length > 2000) {
      chatError.textContent = 'Escribe hasta 2000 caracteres por mensaje.';
      chatError.hidden = false;
      return;
    }
    if (!retry) appendMessage('user', question);
    chatInput.value = '';
    chatError.hidden = true;
    retryChat.hidden = true;
    failedQuestion = null;
    setBusy(true);
    const pending = appendMessage('bot', 'Estoy revisando la información del sitio…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);
    try {
      // Bound both turn count and UTF-8 request bytes; keep the current question.
      const messages = [...history.slice(-10), { role: 'user', content: question }];
      const encoder = new TextEncoder();
      while (messages.length > 1 && encoder.encode(JSON.stringify({ messages })).byteLength > 16000) {
        messages.splice(0, 2);
      }
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(response.status === 429
        ? 'Has enviado varias consultas. Espera un minuto antes de volver a intentarlo.'
        : data.error || 'El asistente no está disponible en este momento. Intenta de nuevo.');
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('No recibí una respuesta. Intenta de nuevo.');
      pending.textContent = data.reply;
      history.push({ role: 'user', content: question }, { role: 'assistant', content: data.reply });
      if (history.length > 10) history.splice(0, history.length - 10);
    } catch (error) {
      pending.remove();
      failedQuestion = question;
      chatError.textContent = error.name === 'AbortError'
        ? 'La consulta tardó demasiado. Puedes volver a intentarlo.'
        : error.message;
      chatError.hidden = false;
      retryChat.hidden = false;
    } finally {
      clearTimeout(timeout);
      setBusy(false);
      chatBody.scrollTop = chatBody.scrollHeight;
      chatInput.focus();
    }
  }

  if (btnSend && chatInput) {
    btnSend.addEventListener('click', () => handleUserMessage(chatInput.value));
    chatInput.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        handleUserMessage(chatInput.value);
      }
    });
    const topics = {
      sap: '¿Qué servicios de SAP Integration Suite ofrecen?',
      bpm: '¿Cómo pueden ayudarme con aprobaciones y procesos BPM?',
      chatbot: '¿Qué canales e integraciones ofrecen para chatbots?',
      cotizar: '¿Cómo solicito una cotización y qué información debo enviar?'
    };
    quickButtons.forEach(btn => btn.addEventListener('click', () => handleUserMessage(topics[btn.getAttribute('data-topic')])));
    retryChat.addEventListener('click', () => { if (failedQuestion) handleUserMessage(failedQuestion, true); });
    resetChat.addEventListener('click', () => {
      if (busy) return;
      history.length = 0;
      failedQuestion = null;
      chatBody.replaceChildren();
      appendMessage('bot', '¡Hola! Soy el asistente de Nexus Automations. Puedo ayudarte con nuestros servicios, la calculadora de ahorro y cómo solicitar un diagnóstico. ¿Qué te gustaría saber?');
      chatError.hidden = true;
      retryChat.hidden = true;
      chatInput.focus();
    });
  }

  // 3. Modal Booking Logic
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const formErrorAlert = document.getElementById('formErrorAlert');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      bookingModal.classList.add('active');
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = bookingForm.querySelector('button[type="submit"]');
      if (submitButton.disabled) return;
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
      formSuccessAlert.style.display = 'none';
      formErrorAlert.hidden = true;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(bookingForm)).toString(),
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Submission rejected');
        bookingForm.reset();
        formSuccessAlert.style.display = 'block';
      } catch (error) {
        formErrorAlert.textContent = error.name === 'AbortError'
          ? 'No pudimos confirmar el envío a tiempo. Intenta de nuevo en unos minutos.'
          : 'No se pudo enviar la solicitud. Revisa tu conexión e intenta de nuevo.';
        formErrorAlert.hidden = false;
      } finally {
        clearTimeout(timeout);
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Solicitud de Diagnóstico';
      }
    });
  }
});

