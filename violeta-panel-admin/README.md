# 🟣 Panel Admin Violeta

Panel de administración para el sistema de atención y prevención de violencia de género.

---

## 🚀 Quick Start

### 1. **Instalar dependencias**
```bash
npm install
```

### 2. **Configurar Supabase**
Copia `.env.example` a `.env` y completa:
```
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. **Setup de Base de Datos**
Ejecuta **UN SOLO SCRIPT** en Supabase SQL Editor:

```bash
SETUP_FINAL_COMPLETO.sql
```

Este script hace TODO automáticamente:
- ✅ Crea tabla `alerts` con índices
- ✅ Agrega columna `email` a `profiles`
- ✅ Crea tabla `announcements` (anuncios)
- ✅ Arregla permisos RLS (elimina errores "permission denied")
- ✅ Crea perfil de admin con email
- ✅ Crea 3 incidentes de prueba
- ✅ Crea 3 alertas de prueba
- ✅ Crea 3 anuncios de prueba

### 4. **Iniciar servidor**
```bash
npm run dev
```

---

## 📁 Estructura del Proyecto

```
webapp/
├── src/
│   ├── components/         # Componentes UI reutilizables
│   │   ├── ui/            # Button, Card, Input, Badge, Modal
│   │   ├── Sidebar.jsx    # Menú lateral
│   │   ├── Topbar.jsx     # Barra superior
│   │   └── AlertsPanel.jsx # Panel de alertas flotante
│   ├── pages/             # Páginas principales
│   │   ├── Login.jsx      # Pantalla de login
│   │   ├── Dashboard.jsx  # Dashboard con KPIs
│   │   ├── Incidents/     # Módulo de incidentes
│   │   ├── Users/         # Módulo de usuarias
│   │   └── Testing.jsx    # Módulo de pruebas
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.js     # Autenticación
│   │   ├── useIncidents.js # Gestión de incidentes
│   │   ├── useUsers.js    # Gestión de usuarias
│   │   └── useAlerts.js   # Sistema de alertas
│   └── lib/
│       ├── supabase.js    # Cliente Supabase
│       └── utils.js       # Funciones auxiliares
├── supabase-migrations/   # Migraciones SQL (referencia)
├── public/                # Assets estáticos
├── SETUP_FINAL_COMPLETO.sql  # ⭐ Script principal de setup
├── GUIA_VERIFICACION.md   # Guía de verificación paso a paso
└── .env                   # Variables de entorno
```

---

## ✅ Módulos Implementados (7 de 8 completos)

### **1. Dashboard**
- ✅ 4 KPIs en tiempo real (Usuarias, Activos, Atendidos, Cerrados)
- ✅ Lista de incidentes recientes con fechas específicas
- ✅ Actualizaciones en tiempo real

### **2. Incidentes**
- ✅ Listado completo con búsqueda y filtros
- ✅ **Filtros por fecha**: Hoy, Últimos 7 días, Últimos 30 días
- ✅ Fechas en formato específico (no relativo)
- ✅ Botón "Atender" (cambia estado)
- ✅ Modal de detalle con ubicación
- ✅ Botón "Cerrar Incidente"
- ✅ Notas internas editables

### **3. Usuarias** (Solo Lectura)
- ✅ Grid de tarjetas con perfiles
- ✅ Búsqueda por nombre/teléfono/dirección
- ✅ Modal de detalle con:
  - Contactos de emergencia
  - Estadísticas de incidentes
  - **Últimas 5 alertas**
  - **Últimos 5 incidentes**
- ❌ NO permite crear usuarias (eso lo hace la app móvil)

### **4. Administradores** (Gestión de Acceso)
- ✅ Listar administradores del panel
- ✅ **Crear nuevos admins** (email + password + nombre)
- ✅ Eliminar administradores
- ✅ Búsqueda por email/nombre

### **5. Anuncios** (Comunidad)
- ✅ **CRUD completo** (Crear, Leer, Actualizar, Eliminar)
- ✅ Tipos: Informativo, Advertencia, Urgente, Evento
- ✅ Prioridades: Baja, Media, Alta
- ✅ Estados: Publicado / Borrador
- ✅ Fecha de expiración opcional
- ✅ Filtros: Todos, Publicados, Borradores

### **6. Sistema de Alertas**
- ✅ Panel flotante en tiempo real
- ✅ Badge con contador en Topbar
- ✅ Suscripción con Supabase Realtime
- ✅ Marcar como leída

### **7. Módulo de Pruebas**
- ✅ Formulario para crear alertas personalizadas
- ✅ 3 botones de pruebas rápidas
- ✅ Vista de últimas alertas

### **⏳ Módulos Pendientes**
- System Prompt (configuración IA)
- Reportes (exportación)

---

## 🗄️ Base de Datos (Supabase)

### **Tablas principales:**
- `profiles` - Perfiles de usuarias y administradores (con columna `email`)
- `incidents` - Incidentes/alertas
- `incident_locations` - Ubicaciones GPS
- `alerts` - Sistema de notificaciones
- `announcements` - Anuncios institucionales

### **Características:**
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acceso simples (authenticated_all)
- ✅ Triggers para generar folios automáticos (VIO-2026-00001)
- ✅ Triggers para updated_at en announcements
- ✅ Suscripciones en tiempo real

---

## 🎯 Scripts SQL Importantes

### **FIX_RLS_FINAL.sql** ⭐ CRÍTICO
Arregla las políticas de seguridad. **Ejecutar PRIMERO** antes de usar el panel.

### **SCRIPT_TESTING_UNICO.sql**
Crea datos de prueba completos:
- 1 perfil de admin
- 3 incidentes (activo, atendido, cerrado)
- 3 alertas de prueba

---

## 📚 Documentación Adicional

- **AUDITORIA_COMPLETA.md** - Estado completo del proyecto
- **FEATURES_STATUS.md** - Lista de funcionalidades implementadas
- **ALERTS_TESTING_GUIDE.md** - Guía para probar el sistema de alertas
- **TESTING_GUIDE.md** - Guía de testing general

---

## 🔧 Troubleshooting

### Error: "permission denied for table users"
**Solución:** Ejecuta `FIX_RLS_FINAL.sql` en Supabase SQL Editor

### Error: "No hay perfiles en la base de datos"
**Solución:** Ejecuta `SCRIPT_TESTING_UNICO.sql` para crear datos de prueba

### Los KPIs muestran 0
**Solución:** Verifica que ejecutaste los scripts SQL de migraciones

---

## 🚀 Deployment

### **Desarrollo (localhost)**
```bash
npm run dev
```

### **Producción (Cloudflare Pages)**
```bash
npm run build
wrangler pages deploy dist --project-name violeta-admin
```

---

## 🎨 Stack Tecnológico

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Autenticación:** Supabase Auth
- **Iconos:** Lucide React
- **Animaciones:** Framer Motion

---

## 👥 Equipo

**Dirección Municipal de Seguridad Pública (DMSP)**  
Sistema Violeta - Plataforma de Atención y Prevención

---

## 📝 Licencia

Uso interno - DMSP
