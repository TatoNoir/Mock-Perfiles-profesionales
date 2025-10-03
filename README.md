# Portal de Profesionales

Aplicación Angular para gestión de perfiles profesionales con autenticación opcional.

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── layout/           # Componentes de layout (header, sidebar)
│   │   ├── features/         # Componentes de funcionalidades (search, professional-list)
│   │   └── auth/            # Componentes de autenticación (login)
│   ├── services/            # Servicios (Supabase)
│   ├── models/              # Interfaces y tipos
│   └── app.component.ts     # Componente principal
├── assets/
│   └── styles/              # Estilos globales
├── environments/            # Configuración de entornos
└── main.ts                  # Punto de entrada
```

## Configuración Rápida

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Variables de entorno (opcional):**
   - Copia `src/environments/env.example.js` como `src/environments/env.js`
   - Completa tus credenciales de Supabase
   - Si no defines variables, podrás ver la app pero el login no funcionará

3. **Levantar en desarrollo:**
   ```bash
   npm run start
   ```
   Luego abre http://localhost:4200/

## Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run ng` - CLI de Angular

## Características

- ✅ Acceso directo sin autenticación
- ✅ Lista de profesionales con datos mock
- ✅ Filtros y búsqueda
- ✅ Diseño responsive
- ✅ Integración opcional con Supabase


VISTAS:

👤 Vista de Usuario (Cliente)

El usuario es quien busca profesionales para contratarlos.

✅ Funcionalidades clave:

🔍 Buscar profesionales por nombre, especialidad, experiencia, ciudad.

📋 Ver tarjetas con perfiles de profesionales.

🏷 Filtros por disponibilidad, especialidad y experiencia.

📄 Ver detalles del profesional (modal o página de perfil).

📩 Contactar al profesional (botón que abre formulario, chat o email).

💬 Tal vez dejar una reseña después del contacto.

📐 Interfaz:

Minimalista y clara.

Enfocada en descubrir y contactar.

Sin opciones de edición o administración.

🛡️ Vista de Super Admin

El super admin es quien administra el sistema, controla usuarios, profesionales y configuraciones.

✅ Funcionalidades clave:

👥 Gestión de usuarios (clientes y profesionales):

Ver, editar, suspender, eliminar cuentas.

📦 Gestión de perfiles de profesionales:

Aprobar / Rechazar nuevos perfiles.

Editar información profesional.

📊 Panel de estadísticas:

Total de registros, contactos realizados, especialidades más buscadas, etc.

🛠 Configuraciones globales:

Especialidades disponibles, filtros del buscador, roles de usuarios.

🧾 Acceso a logs o historial de actividad.

📬 Ver mensajes o solicitudes de contacto.

🖥 Interfaz:

Dashboard tipo admin panel.

Navegación lateral con secciones como:

Usuarios

Profesionales

Estadísticas

Configuración

Revisión de Perfiles

Tabla con filtros avanzados y acciones rápidas.