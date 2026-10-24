# Curso IBERO IA — Nexus Automations

Sitio estático HTML, CSS y JavaScript. Incluye calculadora de ROI, asistente conversacional de IA y formulario de diagnóstico conectado a Netlify Forms. Usa las dependencias npm del lockfile y Netlify AI Gateway desde una función; no necesita una base de datos ni claves en el navegador. No implementa autenticación de usuarios.

## Publicar desde GitHub en Netlify

1. En Netlify, selecciona **Add new project → Import an existing project → GitHub**.
2. Autoriza el acceso y selecciona `ivan1063/Curso-IBERO-IA`, rama `main`.
3. Deja vacíos Base directory y Package directory. La configuración raíz `netlify.toml` establece:
   - Build command: `node scripts/build.mjs`
   - Publish directory: `dist`
   - Node.js: `22`
4. Publica el proyecto. La URL se asigna en Netlify; puedes personalizarla después.
5. En **Forms → Enable form detection**, habilita la detección si no está activa y vuelve a desplegar. Confirma que aparece el formulario `diagnostico`.
6. Envía una solicitud con datos reales de prueba y comprueba su recepción en **Forms → diagnostico**. Revisa Spam si no aparece. Configura el destinatario de correo en **Forms → Submission notifications → Add notification** si deseas avisos por email; no se envían automáticamente a un destinatario configurado en este repo.

Cada cambio posterior en `main` inicia un nuevo despliegue si conectas el repositorio con Netlify.

## Carga manual

El chatbot requiere Netlify Functions: usa el despliegue desde GitHub, no una carga manual estática. Para generar solo los recursos estáticos con Node.js 22 o posterior, ejecuta desde la raíz:

```bash
npm ci
node scripts/build.mjs
```

Arrastra **la carpeta `dist`** a la opción de despliegue manual de Netlify. No subas la raíz del repositorio ni toda la carpeta Antigravity. Activa Forms y vuelve a subir `dist` si la detección estaba deshabilitada.

## Verificación local

```bash
node --check Antigravity/app.js
node scripts/build.mjs
python -m http.server 8000 --directory dist
```

Abre `http://localhost:8000`. La calculadora funciona localmente; el chat requiere Netlify Dev o el despliegue real. El servidor Python no procesa Netlify Forms: el formulario requiere el sitio desplegado en Netlify. La interfaz conserva los datos si falla el envío y muestra confirmación solo después de una respuesta HTTP exitosa.

## Archivos publicados y seguridad

El build genera `dist` con solo `index.html`, `app.js`, `styles.css`, `404.html` y `_headers`. Los archivos de agentes y la documentación quedan fuera. `_headers` establece CSP y otras cabeceras para Netlify, permitiendo las fuentes de Google utilizadas en la página.

El chat llama a `/api/chat` (Netlify Function) y usa OpenAI mediante Netlify AI Gateway. No ejecuta acciones en WhatsApp, SAP ni CRM. La calculadora utiliza un supuesto fijo de ahorro del 75%; las métricas y promesas comerciales de la página deben revisarse antes de promocionar el servicio.

Las solicitudes del formulario se almacenan en Netlify Forms, sujetas a la configuración y límites de tu cuenta. Gestiona allí el acceso, la retención y las notificaciones. El éxito HTTP no confirma la entrega de correos; Netlify puede clasificar una solicitud como spam.

El sitio está conectado a Netlify; cada push en main publica una nueva versión. La recepción real del formulario y las cabeceras deben verificarse en la URL publicada.

## Asistente de IA basado en el sitio

- `scripts/knowledge.mjs` extrae el contenido visible de todas las secciones de `Antigravity/index.html`, pie y contacto en cada build. No incluye documentos internos de agentes. El resultado generado (`netlify/lib/site-knowledge.mjs`) se incorpora a la función, fuera de `dist`.
- `netlify/functions/chat.mjs` utiliza el SDK oficial OpenAI y credenciales inyectadas en tiempo de ejecución por Netlify AI Gateway. Modelo predeterminado: `gpt-4.1-mini`, verificado en el catálogo de Netlify. Puede configurarse `CHAT_MODEL` en Netlify, con alcance Functions y un nuevo despliegue.
- No requiere que el visitante aporte claves. No añadas claves al HTML/JS ni variables con prefijos públicos. El consumo de IA descuenta créditos de Netlify; no se han activado recargas ni contratado complementos.
- La función limita a 10 consultas por minuto/IP, 16 KB por solicitud, 2000 caracteres por mensaje y cinco intercambios de contexto. La llamada al proveedor tiene timeout de 25 segundos y no hace reintentos automáticos.
- Se conserva el historial solo en memoria de la pestaña: Nueva conversación o recargar lo elimina. Los mensajes se transmiten al servicio de IA para responder, no se guardan en una base de datos de la aplicación ni se registran en logs propios.
- Las respuestas se muestran como texto. Se instruye al modelo a usar exclusivamente el sitio, reconocer datos faltantes y no tratar métricas publicitarias como garantías. Estas instrucciones reducen errores; no garantizan que toda respuesta de IA sea exacta.
- Si el gateway no está habilitado, falta saldo o falla el proveedor, la interfaz informa del error y permite reintentar. No sustituye la respuesta por una simulación.
- `npm test` verifica validación, contexto, manejo de errores y extracción del sitio. Para probar servidor y navegador juntos: `npx netlify dev` con el proyecto vinculado. No publiques solamente `dist` para esta versión: eso excluiría la función.
