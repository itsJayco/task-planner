# Task Planner

## Descripción

**Task Planner** es una aplicación web desarrollada con Angular para la planificación y gestión de tareas. Permite a los usuarios crear, visualizar y gestionar tareas en una lista interactiva.

## Estructura del Proyecto

```
└── 📁task-planner
    └── 📁src
        └── 📁app
            └── 📁components
                └── 📁task-creation
                    └── task-creation.component.html
                    └── task-creation.component.scss
                    └── task-creation.component.spec.ts
                    └── task-creation.component.ts
                └── 📁task-list
                    └── task-list.component.html
                    └── task-list.component.scss
                    └── task-list.component.spec.ts
                    └── task-list.component.ts
            └── 📁services
                └── task.service.spec.ts
                └── task.service.ts
            └── app-routing.module.ts
            └── app.component.html
            └── app.component.scss
            └── app.component.spec.ts
            └── app.component.ts
            └── app.module.ts
            └── material.module.ts
        └── 📁assets
            └── .gitkeep
        └── favicon.ico
        └── index.html
        └── main.ts
        └── styles.scss
    └── .editorconfig
    └── .gitignore
    └── angular.json
    └── db.json
    └── package-lock.json
    └── package.json
    └── README.md
    └── tsconfig.app.json
    └── tsconfig.json
    └── tsconfig.spec.json
```

## Requisitos del Entorno

1. Angular CLI: 16.2.16
2. Node: 18.17.0

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/itsJayco/task-planner.git
   ```

2. Ve a la carpeta del proyecto:

   ```bash
   cd task-planner
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

## Ejecución

Para iniciar la aplicación en modo de desarrollo, ejecuta el siguiente comando:

```bash
npm start
```

La aplicación estará disponible en http://localhost:4200/

## Estructura de Componentes

1. Task Creation Component: Permite al usuario crear una nueva tarea y añadirla a la lista de tareas.
2. Task List Component: Muestra la lista de tareas creadas, con la opción de editar o eliminar cada una.

## Servicios

1. Task Service: Gestiona las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para las tareas. Se utiliza para interactuar con una base de datos simulada a través de JSON Server.

## Tecnologías

1. Angular: Framework principal para el desarrollo de la aplicación.
2. Angular Material: Para el diseño de la interfaz de usuario.
3. SCSS: Para el manejo de estilos.
4. JSON Server: Simulador de API para desarrollo local.

## Contribución

Si deseas contribuir al proyecto, por favor sigue los siguientes pasos:

1. Crea un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza los cambios y haz commit (git commit -am 'Añadir nueva funcionalidad').
4. Empuja los cambios a la rama (git push origin feature/nueva-funcionalidad).
5. Abre un Pull Request.
