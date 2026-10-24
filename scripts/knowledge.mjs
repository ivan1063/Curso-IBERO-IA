import { load } from 'cheerio';

// Extract the full visitor-facing page, never agent instructions or repository docs.
export function extractKnowledge(html) {
  const $ = load(html);
  $('script, style, template, [hidden], #chatBody, #formSuccessAlert, #formErrorAlert, .chat-input-bar, .chat-notice, .chat-tools, .chat-sources').remove();
  const sections = $('section, footer, #bookingModal').map((_, node) => {
    const part = $(node).clone();
    part.find('input, textarea, select, button').remove();
    part.find('h1,h2,h3,h4,p,li,div').append('\n');
    return { id: $(node).attr('id') || ($(node).hasClass('hero') ? 'inicio' : 'informacion'), text: part.text().replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim() };
  }).get();
  return {
    title: $('title').text(),
    sections,
    notes: 'La calculadora estima personas × horas manuales por semana × 52 × 0.75 × costo/hora en USD. Es un supuesto, no una garantía. Las métricas comerciales publicadas no son SLA contractuales ni evidencia de resultados. El formulario solicita nombre, correo, empresa, área y mensaje; su envío pide contacto, no reserva una cita confirmada. No hay precios específicos, dirección ni teléfono publicados. El asistente no ejecuta agentes, integraciones SAP, pagos ni reservas.'
  };
}
