<p align="center">
  <img src="eventos-frontend/src/assets/logoReadme.png" alt="Eventos Lanzarote" width="200"/>
</p>

# Eventos Lanzarote

Plataforma web de gestión, publicación y visualización de eventos en Lanzarote.



## Autores

- Tania García Álvarez  
- Israel Betancor Hernández



## Cómo surgió nuestra idea
La idea de crear esta plataforma nació al darnos cuenta de algo muy sencillo pero importante: muchas personas no llegan a conocer todos los eventos que se celebran en Lanzarote. Esta necesidad nos impulsó a ponernos manos a la obra y desarrollar un espacio actual, práctico y pensado para todos: tanto para quienes quieren disfrutar de los planes que ofrece la isla, como para las empresas, asociaciones o entidades públicas que buscan dar visibilidad a sus eventos.

Nuestro objetivo es simple: conectar a la gente con lo que ocurre en la isla. Por eso, ofrecemos la posibilidad de que empresas y organizaciones suban sus propios eventos de forma fácil, rápida y gratuita.

Queremos que esta web sea un punto de encuentro para todos, donde la cultura, el ocio y las oportunidades se compartan y crezcan.




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
CREATE DATABASE lztevent;
CREATE USER 'eventos'@'localhost' IDENTIFIED BY 'eventosLanzarote123';
GRANT ALL PRIVILEGES ON lztevent.* TO 'eventos'@'localhost';
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


- **Instalamos Node.js y npm:**
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
#### Verificamos la instalación de git:
```bash
git --version
```

- **Clonamos el repositorio:**
```bash
git clone git@github.com:Israel-Lanza/Eventos-Lanzarote-Web.git
```

- **El proyecto consta de dos entornos de desarrollo para el backend y para el frontend que se comunican a través de Api Rest**
```bash
cd EventosLanzaroteProject
```
#### Para el frontend (React):
```bash
cd eventos-frontend
```
#### Instalamos las dependencias de Node:
```bash
npm install
```
#### Iniciamos el servicio de frontend:
```bash
npm run dev
```

#### Para el backend (Laravel 12):
```bash
cd ../eventos-backend
```

#### Instalamos las dependencias de composer:
```bash
composer install
```

#### Copiamos el archivo .env y configuramos generando la clave de encriptación:
```bash
cp .env.example .env
php artisan key:generate
```

#### Configurar la conexión a la base de datos en el .env:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lztevent
DB_USERNAME=eventos
DB_PASSWORD=eventosLanzarote123
```

#### Ejecutamos las migraciones:
```bash
php artisan migrate
php artisan db:seed --class=CategoriaSeeder
php artisan db:seed --class=EventoSeeder
```

#### Iniciamos el servicio de backend:
```bash
php artisan serve
```

#### Teniendo los dos servicios iniciados deberiamos ver la página accediendo por http://localhost:5173/




## Enlaces a los documentos sobre el proceso de desarrollo del proyecto:
- [**Boceto**](https://drive.google.com/file/d/1iPi_ieeidU-0k02u3R_xJXukr9Ffryam/view?usp=drive_link)
- [**Documento de análisis**](https://drive.google.com/file/d/1RDNgwVFLVBp8eyhhL0Vc9MOFGiT2TUwl/view?usp=drive_link)
- [**Documento de diseño**](https://drive.google.com/file/d/13TJVPfgz5CT3PRIkXGGZ5l1eWEQpg20K/view?usp=drive_link)
- [**Estructura de la base de datos**](https://drive.google.com/file/d/19Xnba_sworVszFnuBizqtc2cx0QMoHCI/view?usp=drive_link)
- [**Documento de pruebas unitarias**](https://drive.google.com/file/d/133UkowksEFDaLdQOXN5R7KrtBN35h2UD/view?usp=drive_link)




## Visita nuestra página web (proyecto):
- [**Eventos Lanzarote**](https://www.eventoslanzarote.es)

## Vídeo explicación del proyecto en Youtube:
- [**Video explicativo proyecto web Eventos Lanzarote**](https://www.youtube.com/watch?v=AilzSOfRrGQ&ab_channel=TaniaGarciaAlvarez)
