[Back](general.md)
# Usar la imagen base de Alpine
    FROM alpine:latest

# Instalar OpenSSH + Git
    RUN apk add --no-cache openssh
    RUN apk add --no-cache git

# Posiciona en el directorio
    WORKDIR /root/apps

# Configurar SSH para aceptar conexiones
    RUN echo "PermitRootLogin yes" >> /etc/ssh/sshd_config && \
        echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config && \
        echo "root:toor" | chpasswd && \
        mkdir -p /root/.ssh && chmod 700 /root/.ssh
    RUN ssh-keygen -A

# Instalar NodeJs + NPM
    RUN apk add --no-cache nodejs 
    RUN apk add --no-cache npm 

# Exponer el puerto para la app react vite + SSH 
    EXPOSE 5173
    EXPOSE 22 

# Comando para iniciar SSH
    CMD ["/usr/sbin/sshd", "-D"]

# Comando para iniciar app comentado
    #CMD ["npm", "start"]
