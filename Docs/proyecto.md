# Star Peruvian — Decisiones del proyecto

## E-commerce v1 — Product sin variantes (2026-09-04)

**Decisión:** `Product` se mantiene simple: un producto = un precio y un stock
únicos. `colors` y `sizes` siguen siendo metadata informativa (arrays JSON),
no controlan stock ni precio por combinación.

**Por qué:**
- Es el modelo que ya existe en producción (11 productos reales cargados) —
  no rompe nada.
- El negocio es mayorista (`minOrder` por producto, venta por lote/docena),
  no venta unitaria donde el color/talla exacto importe para el stock.
- Simplifica el descuento atómico de stock al confirmar una orden: un solo
  `UPDATE` con `WHERE stock >= qty` por producto, sin tener que resolver
  combinaciones de variante.
- Order/OrderItem quedan más simples para v1 (referencian `productId`
  directo, sin `variantId`).

**Camino de escape (si se necesitan variantes reales más adelante):**
Agregar una tabla `ProductVariant` (FK a `Product`) con su propio
`stock`/`price`/`sku`, y mover ahí el control de inventario sin tocar
`colors`/`sizes` como metadata visual. No requiere rediseñar Order/OrderItem
desde cero: solo agregar `variantId` opcional.

## Carrito — localStorage, no servidor (2026-09-04)

**Decisión:** el carrito vive en `localStorage` del frontend hasta que el
usuario confirma el checkout. No hay tabla `Cart`/`CartItem` en el backend.

**Por qué:** un carrito servidor requiere sesiones (anónimas o por usuario),
expiración, y limpieza de carritos huérfanos — complejidad que no aporta
nada en v1 porque el checkout de todos modos tiene que revalidar precio y
stock contra la BD en el momento de pagar (nunca se confía en lo que mandó
el cliente). Si más adelante se quiere carrito persistente entre
dispositivos, se agrega sin tocar el checkout: solo se hidrata el
localStorage desde el servidor al iniciar sesión.

---

## Migraciones (2026-09-04)

Se reemplazó `sequelize.sync({ alter: true })` por migraciones versionadas
con `sequelize-cli` (`backend/migrations/`). Motivo: `sync({ alter: true })`
había generado 21 índices UNIQUE duplicados en `users.username` y 19 en
`reclamaciones.numero_correlativo` (uno nuevo en cada reinicio del server).

Comandos:
- `npx sequelize-cli db:migrate` — aplicar migraciones pendientes.
- `npx sequelize-cli db:migrate:undo` — revertir la última.

El server ya **no** sincroniza el esquema al arrancar; las migraciones se
corren aparte, manualmente (o en el pipeline de deploy más adelante).

## Entorno local (2026-09-04)

Desarrollo corre contra MySQL/MariaDB local en Docker
(`docker-compose.yml`, servicio `mysql`, puerto 3306), con un dump de la
BD real de Hostinger ya importado. `backend/.env` apunta a `127.0.0.1`.
Nunca se desarrolla contra la BD de producción (`srv1368.hstgr.io`).
