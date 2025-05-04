<p align="center">
  <img src="eventos-frontend/src/assets/logoReadme.png" alt="Eventos Lanzarote" width="200"/>
</p>

# Eventos Lanzarote

Plataforma web de gestión, publicación y visualización de eventos en Lanzarote.



## Autores

- Tania García Álvarez  
- Israel Betancor Hernández



## Características

- Plataforma web para descubrir, publicar y gestionar eventos en Lanzarote.
- Usuarios individuales o empresas promotoras de eventos pueden registrar y gestionar sus propios eventos.
- Los administradores validan eventos desde un panel de administrador para que aparezcan en la página principal.
- Sistema de registro, verificación por email y recuperación de contraseña.
- Búsqueda por nombre y categorías, con filtros para facilitar la navegación.
- Soporte multilenguaje (incluye inglés).
- Botones para compartir eventos por WhatsApp, Facebook y X.
- Dominio propio con hosting: [https://www.eventoslanzarote.es](https://www.eventoslanzarote.es)



## Instalación

### Requisitos para ejecutar el proyecto en local

- **PHP >= 8.2 y extensiones necesarias:**

```bash
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php php-cli php-mbstring php-xml php-bcmath php-curl php-zip unzip curl -y
```

#### Confirmamos la instalación de PHP:
```bash
php -v
```

- **MySQL:**
```bash
sudo apt install mysql-server php-mysql -y
```
#### Instalamos MySQL y configuramos la base de datos:
```bash
sudo apt install mysql-server php-mysql -y
```
#### Creamos la base de datos y el usuario:
```bash
sudo mysql
CREATE DATABASE eventos_lanzarote;
CREATE USER 'eventos'@'localhost' IDENTIFIED BY 'eventosLanzarote';
GRANT ALL PRIVILEGES ON eventos_lanzarote.* TO 'eventos'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

- **Composer:**
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
#### Verificamos la instalación de Composer:
```bash
composer --version
```


- **Node.js y npm:**
```bash
sudo apt update
sudo apt install nodejs npm -y
```
#### Verificamos la instalación y las versiones:
```bash
node -v
npm -v
```


- **Git:**
```bash
sudo apt install git
```
#### Verificamos la instalación:
```bash
git --version
```

- **Clonamos el repositorio:**
```bash
git clone git@github.com:Israel-Lanza/Eventos-Lanzarote-Web.git
```




















## Visita nuestra página web (proyecto):
[https://www.eventoslanzarote.es](https://www.eventoslanzarote.es)

## Vídeo explicación del proyecto en Youtube:
