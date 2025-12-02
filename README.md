# 💰 Control de Gastos

Aplicación web para el control personal de gastos, con diseño responsive optimizado para mobile y desktop.

## ✨ Características

### Versión Actual (v1.0)

- **Ingreso rápido de gastos** con mínima fricción
- **Categorías predefinidas** con iconos visuales:
  - 🍔 Comida
  - 🚗 Transporte
  - 💡 Servicios
  - 🎬 Entretenimiento
  - ⚕️ Salud
  - 📚 Educación
  - 🛍️ Compras
  - 🏠 Hogar
  - 📌 Otros

- **Fecha automática** (actual) pero editable
- **Persistencia local** mediante localStorage del navegador
- **Vista responsive** optimizada para mobile y desktop
- **Filtros temporales**: Todos, Hoy, Esta Semana, Este Mes
- **Total calculado** según el filtro activo
- **Interfaz moderna** con modo oscuro automático
- **Accesos rápidos por teclado** (desktop)

## 🚀 Uso

### Abrir la aplicación

**Opción 1: Local**
Simplemente abre el archivo `index.html` en tu navegador web preferido. No requiere instalación ni servidor.

**Opción 2: GitHub Pages**
Si has desplegado la aplicación en GitHub Pages, accede a través de la URL: `https://[tu-usuario].github.io/[nombre-repositorio]`

### Agregar un gasto

1. Ingresa el monto
2. Selecciona una categoría
3. (Opcional) Agrega una descripción
4. La fecha se establece automáticamente al día actual, pero puedes editarla
5. Presiona Enter o haz clic en "Agregar Gasto"

### Filtrar gastos

Usa las pestañas de filtro para ver:
- **Todos**: Todos los gastos registrados
- **Hoy**: Gastos de hoy
- **Esta Semana**: Gastos de esta semana
- **Este Mes**: Gastos del mes actual

### Eliminar gastos

- Haz clic en el ícono 🗑️ de cualquier gasto para eliminarlo
- Usa "Limpiar Todo" para eliminar todos los gastos

### Atajos de teclado (Desktop)

- `Alt/Option + N`: Enfocar campo de monto para agregar nuevo gasto
- `Enter`: Enviar formulario

## 📱 Compatibilidad

- ✅ Chrome/Edge (moderno)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Navegadores móviles modernos

## 💾 Almacenamiento

Los datos se guardan localmente en tu navegador usando `localStorage`. Esto significa:

- ✅ **Privacidad total**: Los datos nunca salen de tu dispositivo
- ✅ **Rápido**: Acceso instantáneo sin conexión a internet
- ⚠️ **Por navegador**: Los datos no se sincronizan entre dispositivos
- ⚠️ **Por dominio**: Si cambias de dominio/puerto, los datos no estarán disponibles

### Persistencia de datos

Los datos persisten entre sesiones siempre que:
- No borres los datos del navegador
- No uses modo incógnito/privado (los datos se eliminan al cerrar)
- No cambies de navegador

## 🎨 Diseño

La aplicación utiliza un diseño **mobile-first** que se adapta automáticamente:

- **Mobile** (< 640px): Vista en una columna, optimizada para uso con una mano
- **Tablet** (640px - 1023px): Vista optimizada con más espacio
- **Desktop** (≥ 1024px): Vista de dos columnas con formulario fijo y lista scrolleable

### Modo oscuro

La aplicación detecta automáticamente la preferencia de modo oscuro del sistema operativo.

## 🔮 Roadmap (Futuras Iteraciones)

### v2.0 - Tarjetas de Crédito y Cuotas
- Gestión de tarjetas de crédito
- Gastos en cuotas
- División automática de costos en meses subsiguientes
- Visualización de gastos "virtuales" por cuotas pendientes

### Otras mejoras planificadas
- Exportar datos (CSV, JSON)
- Gráficos y estadísticas
- Presupuestos por categoría
- Búsqueda de gastos
- Edición de gastos existentes
- Backup/restore en la nube (opcional)

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsive con CSS Grid y Flexbox
- **JavaScript (Vanilla)**: Sin frameworks, máxima performance
- **LocalStorage API**: Persistencia de datos

## 🌐 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages.

### Configuración inicial

1. Ve a la configuración de tu repositorio en GitHub: `Settings > Pages`
2. En la sección **Build and deployment**:
   - **Source**: Selecciona "GitHub Actions"
3. Guarda los cambios

### Despliegue automático

Una vez configurado, el sitio se desplegará automáticamente cuando:
- Se haga push a la rama `main`
- Se ejecute manualmente desde la pestaña **Actions** en GitHub

### URL de acceso

Después del primer despliegue exitoso, tu aplicación estará disponible en:
```
https://[tu-usuario].github.io/[nombre-repositorio]
```

### Verificar el despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verifica que el workflow "Deploy en GitHub Pages" se haya ejecutado correctamente
3. Una vez completado, accede a la URL de GitHub Pages

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.
