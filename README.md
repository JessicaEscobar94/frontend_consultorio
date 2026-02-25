# Frontend – Sistema de Consultorio Médico

## 📌 Descripción general

Este proyecto corresponde al **frontend del sistema de gestión para un consultorio médico**, desarrollado como parte de la **Práctica Profesional Supervisada (PPS).**

La aplicación web permite a los distintos usuarios del sistema interactuar con el backend para:

* autenticarse en el sistema,

* gestionar turnos médicos,

* consultar información según su rol,

* administrar historias clínicas.

El frontend consume una API REST desarrollada en Node.js.

---

## 🛠️ Tecnologías utilizadas

* React

* JavaScript

* HTML5

* CSS3

* Fetch API para comunicación con el backend

##  Arquitectura de la aplicación

El frontend funciona como cliente del sistema y se comunica exclusivamente con el backend mediante requests HTTP.

Arquitectura general:

* **Frontend (React)**: interfaz gráfica utilizada por los usuarios.

* **Backend (API REST)**: gestiona la lógica de negocio, seguridad y persistencia de datos.

El frontend no accede directamente a la base de datos, sino que todas las operaciones se realizan a través de la API.

---

## 🔐 Seguridad e integración con la API

**🔑 API_KEY**

Todas las requests enviadas desde el frontend incluyen una **API_KEY** en los encabezados HTTP, requerida por el backend para permitir el acceso a sus rutas.

La API_KEY es gestionada mediante variables de entorno y no se encuentra expuesta en el código fuente.

**🔐 Autenticación con JWT**

El proceso de autenticación se realiza de la siguiente manera:

1. El usuario ingresa sus credenciales en el frontend.

2. El frontend envía las credenciales al endpoint /login del backend.

3. El backend devuelve un token JWT.

4. El frontend almacena el token y lo envía en cada request protegida mediante el header:

```bash
Authorization: Bearer <token>
```

---

## 🔐 Funcionalidades según rol de usuario

La aplicación implementa un sistema de acceso por roles, donde la interfaz y las acciones disponibles se adaptan según el rol del usuario autenticado.

El rol se obtiene a partir del token JWT devuelto por el backend al iniciar sesión.

Los roles implementados en el frontend son:

* PACIENTE

* MEDICO

* SECRETARIA

---

### 👤 Paciente

El rol Paciente permite a los usuarios gestionar sus propios turnos médicos. Desde la interfaz correspondiente, el paciente puede:

* visualizar el listado de médicos disponibles,

* consultar horarios disponibles,

* solicitar nuevos turnos médicos,

* visualizar sus turnos activos,

* cancelar turnos propios.

El paciente solo puede acceder a información relacionada con su cuenta y no tiene acceso a datos de otros usuarios ni a historias clínicas.

---

### 👩‍⚕️ Médico

El rol Médico está orientado a la atención profesional y a la gestión clínica de los pacientes. Desde su panel, el médico puede:

* visualizar los turnos asignados,

* seleccionar un turno activo,

* consultar las historias clínicas asociadas a un paciente,

* crear nuevas historias clínicas,

* eliminar historias clínicas existentes.

El médico únicamente puede acceder a información relacionada con sus turnos y pacientes asignados.

---

### 🧾 Secretaria

El rol Secretaria permite la gestión operativa del consultorio. Desde su interfaz, la secretaria puede:

* visualizar todos los turnos activos del sistema,

* registrar nuevos turnos médicos de pacientes ya registrados,

* registrar nuevos turnos de pacientes no registrados,

* cancelar turnos.


Este rol no tiene acceso a la creación ni edición de historias clínicas.

---

## 🔒 Control de permisos

Si bien el frontend adapta la interfaz según el rol del usuario, el control definitivo de permisos se encuentra implementado en el backend, garantizando que ninguna acción sensible pueda ejecutarse sin la autorización correspondiente.

La separación de funcionalidades por rol permite garantizar la seguridad de la información sensible y una correcta organización de responsabilidades dentro del sistema.

---

## ⚙️ Variables de entorno

El frontend utiliza variables de entorno para configurar la URL del backend y la API_KEY.

---

## ▶️ Instalación y ejecución local

1. Clonar el repositorio:
2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo de variables de entorno correspondiente (.env).

4. Iniciar la aplicación:

```bash
npm start
```

La aplicación quedará disponible en el navegador.

---

##  Despliegue

El frontend se encuentra desplegado en Vercel.

🔗 URL pública de la aplicación:
https://pps-frontend-escobar.vercel.app/
