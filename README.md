# peliculas_2025

## Configuración Inicial

Crea un archivo `config.js` en la raíz del proyecto y agrega lo siguiente con tu clave de API de The Movie Database:

```javascript
const API_KEY = "TU_API_KEY";
```

## Instrucciones: Cómo ejecutar el proyecto

Para correr este proyecto, por favor sigue los siguientes pasos:

1.  **Descargar y Descomprimir**: Descarga el proyecto desde el repositorio de GitHub como un archivo ZIP y descomprímelo en tu máquina.

2.  **Configurar la API Key**: Como se mencionó arriba, crea un archivo `config.js` en la carpeta raíz y añade tu API key de TMDb.

3.  **Abrir una Terminal**: Navega hasta la carpeta raíz del proyecto descomprimido usando una terminal o línea de comandos.

4.  **Instalar Dependencias**: Ejecuta el siguiente comando para instalar las dependencias del proyecto. Necesitarás tener [Node.js](https://nodejs.org/) (que incluye npm) instalado en tu sistema.
    ```bash
    npm install
    ```

5.  **Construir los Estilos (SASS)**: El proyecto usa SASS. Compila los estilos a CSS con el siguiente comando:
    ```bash
    npm run build
    ```

6.  **Iniciar el Servidor**: Lanza el servidor de desarrollo local con este comando:
    ```bash
    npm start
    ```

7.  **Ver la Aplicación**: Abre tu navegador web y ve a la siguiente dirección: [http://localhost:8081](http://localhost:8081)

La aplicación debería estar corriendo correctamente.
