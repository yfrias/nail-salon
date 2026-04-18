# Contexto del Proyecto — Nail Studio

## Proyecto
Aplicación web para salón de uñas en `/Users/yudier/Cluade_ejemplo/nail-salon/`.
Stack: React 19 + TypeScript + Vite + Bun. Sin backend — persistencia en localStorage.

## Lo que se construyó
- **Landing page** con hero, servicios destacados y CTA
- **Autenticación**: registro y login de clientes
- **Catálogo de servicios** con filtros por categoría y búsqueda
- **Agendamiento de citas**: selector de fecha/hora con slots bloqueados si ocupados
- **Portal cliente** (`/mis-citas`): ver y cancelar citas propias
- **Panel Admin** (`/admin`):
  - Dashboard con métricas de negocio
  - CRUD de servicios con subida de imágenes (archivo o URL)
  - Gestión de citas: aprobar/cancelar, filtros por estado y fecha
  - **Clientes** (`/admin/clientes`): estadísticas globales, top 3 clientes, historial por cliente
  - Modal "Crear Cita": el admin puede registrar un cliente nuevo o seleccionar uno existente y crearle la cita directamente (queda confirmada)

## Cuentas demo
- Admin: `admin@nailstudio.com` / `admin123`
- Cliente: `maria@ejemplo.com` / `123456`

## MCP Server
- Repo local: `/Users/yudier/Cluade_ejemplo/nail-salon-mcp/`
- GitHub: `https://github.com/yfrias/agenda-online-2`
- URL activa: `https://model-context-protocol-mcp-with-ver-wheat-kappa.vercel.app/mcp`
- Configurado en: `/Users/yudier/Cluade_ejemplo/.claude/settings.json`
- Herramientas: `roll_dice`, `get_weather`
- Estado: desplegado y público ✓
