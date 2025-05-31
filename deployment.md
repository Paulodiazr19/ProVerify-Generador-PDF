# Guía de Despliegue en Netlify

## Opción 1: Despliegue Directo (Recomendado)

1. **Descarga el proyecto**
   - Descarga todos los archivos del proyecto
   - Asegúrate de tener la estructura completa

2. **Instala Node.js**
   - Descarga e instala Node.js desde https://nodejs.org
   - Verifica la instalación: `node --version`

3. **Prepara el proyecto**
   \`\`\`bash
   cd certificado-litigios
   npm install
   npm run build
   \`\`\`

4. **Sube a Netlify**
   - Ve a https://netlify.com
   - Arrastra la carpeta `out` generada al área de despliegue
   - Tu sitio estará listo en minutos

## Opción 2: Despliegue con GitHub

1. **Sube a GitHub**
   - Crea un nuevo repositorio en GitHub
   - Sube todos los archivos del proyecto

2. **Conecta con Netlify**
   - En Netlify, selecciona "New site from Git"
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración

3. **Configuración automática**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18

## Variables de Entorno

No se requieren variables de entorno especiales para este proyecto.

## Dominio Personalizado

1. En Netlify, ve a "Domain settings"
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

## SSL

Netlify proporciona SSL automático para todos los sitios.

## Actualizaciones

Para actualizar el sitio:
1. Modifica los archivos
2. Ejecuta `npm run build`
3. Sube la nueva carpeta `out` a Netlify

¡Tu certificador de litigios estará listo para usar!
