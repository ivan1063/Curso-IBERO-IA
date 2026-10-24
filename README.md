# Curso IBERO IA — Nexus Automations

Sitio estático HTML, CSS y JavaScript. Incluye calculadora de ROI, chat de demostración y formulario de diagnóstico conectado a Netlify Forms. No necesita dependencias npm, base de datos, claves de API ni variables secretas. No implementa autenticación de usuarios.

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

Con Node.js 22 o posterior, ejecuta desde la raíz:

```bash
node scripts/build.mjs
```

Arrastra **la carpeta `dist`** a la opción de despliegue manual de Netlify. No subas la raíz del repositorio ni toda la carpeta Antigravity. Activa Forms y vuelve a subir `dist` si la detección estaba deshabilitada.

## Verificación local

```bash
node --check Antigravity/app.js
node scripts/build.mjs
python -m http.server 8000 --directory dist
```

Abre `http://localhost:8000`. La calculadora y el chat funcionan localmente. El servidor Python no procesa Netlify Forms: el formulario requiere el sitio desplegado en Netlify. La interfaz conserva los datos si falla el envío y muestra confirmación solo después de una respuesta HTTP exitosa.

## Archivos publicados y seguridad

El build genera `dist` con solo `index.html`, `app.js`, `styles.css`, `404.html` y `_headers`. Los archivos de agentes y la documentación quedan fuera. `_headers` establece CSP y otras cabeceras para Netlify, permitiendo las fuentes de Google utilizadas en la página.

El chat usa respuestas predefinidas y presenta la entrada del visitante como texto, sin interpretar HTML. No hay conexión activa con IA, WhatsApp, SAP ni CRM. La calculadora utiliza un supuesto fijo de ahorro del 75%; las métricas y promesas comerciales de la página deben revisarse antes de promocionar el servicio.

Las solicitudes del formulario se almacenan en Netlify Forms, sujetas a la configuración y límites de tu cuenta. Gestiona allí el acceso, la retención y las notificaciones. El éxito HTTP no confirma la entrega de correos; Netlify puede clasificar una solicitud como spam.

No se ha realizado un despliegue desde esta preparación. La recepción real del formulario y las cabeceras se deben comprobar en la URL publicada.
