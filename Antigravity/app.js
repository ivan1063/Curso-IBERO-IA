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

  // 2. Interactive Chatbot Simulator Logic
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const quickButtons = document.querySelectorAll('.quick-btn');

  const botResponses = {
    sap: "¡Excelente! En **SAP Integration Suite**, diseñamos iFlows en Cloud Integration (CPI) para conectar S/4HANA con CRM, e-commerce y pasarelas de pago. Manejamos OData, RFCs, BAPIs y scripts Groovy con 99.9% de uptime y manejo automático de excepciones.",
    bpm: "Para **BPM y Procesos**, implementamos flujos BPMN 2.0 en Camunda y SAP Build Process Automation. Automatizamos aprobaciones de compras, altas de empleados y conciliaciones financieras con escalamiento por timers y firmas digitales.",
    chatbot: "Nuestros **Chatbots Omnicanal** operan en WhatsApp Business Cloud API, Web y Telegram. Tienen IA con RAG conectada a tu ERP/CRM (HubSpot/Salesforce) para calificar prospectos y atender dudas 24/7 con traspaso automático a operadores humanos.",
    cotizar: "Para cotizar tu proyecto a la medida, puedes agendar una sesión de arquitectura de 20 minutos con nuestro Director de Automatización haciendo clic en el botón 'Agendar Diagnóstico'. ¡Es totalmente gratuito!"
  };

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg msg-${sender}`;
    msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleUserMessage(userText) {
    if (!userText || !userText.trim()) return;
    appendMessage('user', userText);

    // Bot Thinking indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg msg-bot';
    typingDiv.innerHTML = '<em>Escribiendo...</em>';
    typingDiv.id = 'botTyping';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      const typingEl = document.getElementById('botTyping');
      if (typingEl) typingEl.remove();

      const lower = userText.toLowerCase();
      let response = "Entendido. Como agencia especializada, podemos crear una solución combinada de SAP Integration Suite, flujos BPM y Chatbots para resolver ese desafío en semanas. ¿Te gustaría agendar una demo técnica?";

      if (lower.includes('sap') || lower.includes('btp') || lower.includes('cpi') || lower.includes('iflow')) {
        response = botResponses.sap;
      } else if (lower.includes('bpm') || lower.includes('proceso') || lower.includes('camunda') || lower.includes('flujo')) {
        response = botResponses.bpm;
      } else if (lower.includes('bot') || lower.includes('whatsapp') || lower.includes('chat') || lower.includes('ia')) {
        response = botResponses.chatbot;
      } else if (lower.includes('precio') || lower.includes('cotiz') || lower.includes('costo') || lower.includes('demo')) {
        response = botResponses.cotizar;
      }

      appendMessage('bot', response);
    }, 600);
  }

  if (btnSend && chatInput) {
    btnSend.addEventListener('click', () => {
      handleUserMessage(chatInput.value);
      chatInput.value = '';
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleUserMessage(chatInput.value);
        chatInput.value = '';
      }
    });
  }

  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      if (topic === 'sap') {
        handleUserMessage('¿Cómo integran SAP Integration Suite?');
      } else if (topic === 'bpm') {
        handleUserMessage('¿Cómo automatizan procesos con BPM?');
      } else if (topic === 'chatbot') {
        handleUserMessage('¿Qué capacidades tienen los chatbots para pymes?');
      } else if (topic === 'cotizar') {
        handleUserMessage('Quiero agendar una cotización para mi empresa');
      }
    });
  });

  // 3. Modal Booking Logic
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

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
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      bookingForm.style.display = 'none';
      formSuccessAlert.style.display = 'block';
      setTimeout(() => {
        bookingModal.classList.remove('active');
        setTimeout(() => {
          bookingForm.reset();
          bookingForm.style.display = 'block';
          formSuccessAlert.style.display = 'none';
        }, 500);
      }, 2500);
    });
  }
});
