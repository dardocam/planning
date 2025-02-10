# Creacion

### Datos Utiles
- El contenedor monta su carpeta interna /root/apps con la carpeta 'apps' que se encuentra en nuestra maquina o la creamos, asi podemos utilizar Visual Studio Code para editar directamente. Ingresamos al contenedor via ssh para ejecutar los comandos de git y npm

### Construccion del contenedor en base al archivo [Dockerfile](fileDocker.md)

    sudo docker build -t alpine-ssh .

    sudo docker run --name alpine-ssh-container -v ./apps:/root/apps -p 2222:22 -p 5173:5173 -d alpine-ssh



### Bash script para detener y remover todos los contenedores 

    #!/bin/bash

    empty=$(sudo docker ps -a -q)


    if [ -z "${empty}" ]; then
        echo "VAR is unset or set to the empty string"
    else
        sudo docker stop $(sudo docker ps -a -q)
        echo "Stopping containers"
        sleep 1
        sudo docker rm $(sudo docker ps -a -q)
        echo "Removing containers"
        sleep 1
        echo "Done"
    fi

### Algunos comandos importantes para Docker
    sudo docker images
    sudo docker rmi
    sudo docker ps -a -q


### Ingreso al contenedor
    ssh root@localhost -p 2222


### Scaffolding
    npm create vite@latest

- Luego vincular con el repositorio en https://github.com
- Respetar el archivo .gitignore creado por vite. No subir node_modules, dist, etc

### Deploy en GitHub Pages

    npm install gh-pages --save-dev

Agregar scripts en package.json:

    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "deploy": "gh-pages -d dist"
    }

Desplegar la aplicación: Construye y despliega:

    npm run build
    npm run deploy




### Editar vite.config.js
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react-swc";

    // https://vite.dev/config/
    export default defineConfig({
    plugins: [react()],
    base: "https://dardocam.github.io/planning/",
    });

### Iniciar la app exponiendo el contenedor a la red

    npm run dev -- --host