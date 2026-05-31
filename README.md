[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/hMa_WFnH)
# CoreHardware - Payments

Aplicación **Payments** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `CoreHardware`.

Esta app corresponde al módulo de pagos en los proyectos de tipo **A (Transporte)**, **B (Delivery)** y **C (Marketplace)**.

Enunciado completo: <https://iaw-2026.github.io/proyecto/>

---

# Instrucciones

## Deploy

- Deploy de branch develop: https://proyecto-c-payments2-corehardware-git-develop-agusf22s-projects.vercel.app/

## Variables de entorno

Para que el proyecto funcione correctamente se requiere configurar las siguientes variables.

### Base de datos
- **DATABASE_URL**: URL de base de datos PostgreSQL.
### Clerk
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Clave publica de Clerk.
- **CLERK_SECRET_KEY**: Clave privada de Clerk.
### Mercadopago
- **MERCADOPAGO_ACCESS_TOKEN**: Access token de la cuenta de mercadopago dueña de la app.
- **MERCADOPAGO_SECRET_KEY**: Clave secreta para autenticacion de POST al webhook de la app proveniente de mercadopago luego de un evento.
- **MERCADOPAGO_CLIENT_ID**: Client ID de la app creada en mercadopago.
- **MERCADOPAGO_CLIENT_SECRET**: Client secret de la app creada en mercadopago.
- **NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY**: Clave publica para cifrado de tarjetas de mercado pago, no necesaria en versiones del proyecto que implementan flujo marketplace.
- **MERCADOPAGO_REDIRECT_URI**: URL de redireccion luego de autenticacion de vendedores.
### Otras
- **NEXT_PUBLIC_TEST_SELLER_CLERK_ID** (Opcional): Si se usan las pantallas de testing, user id de Clerk de una cuenta con rol seller.

## Credenciales de prueba

### Users de clerk

- Admin: admin1+clerk_test@example.com
- Comprador: buyer1+clerk_test@example.com
- Vendedor: seller1+clerk_test@example.com

Para loguearse ingresar el mail y cuando pida contraseña seleccionar ingresar de otro modo, por codigo de confirmacion enviado al mail, e ingresar **424242**

### Cuentas de mercadopago

#### Marketplace dueño de la app
- User ID: **3432030204**
- Usuario: **TESTUSER625096611424863304**
- Contraseña: **xO08JXUGxm**
- Código de verificación: **030204**

#### Vendedor
- User ID: **3432219260**
- Usuario: **TESTUSER4163024715489193368**
- Contraseña: **gcIIJ2VEVG**
- Código de verificación: **219260**

### Tarjetas de prueba

- Tarjeta: **Visa**
- Número: **4509 9535 6623 3704**
- Código de seguridad: **123**
- Fecha de caducidad: **11/30**
- Documento de identidad: **(DNI) 12345678**

#### Codigos para probar diferentes resultados (van en el campo nombre)
- **APRO**: Pago aprobado.
- **OTHE**: Rechazado por error general.
- **CONT**: Pendiente de pago.
- **CALL**: Rechazado con validación para autorizar.
- **FUND**: Rechazado por importe insuficiente.
- **SECU**: Rechazado por código de seguridad inválido.
- **EXPI**: Rechazado debido a un problema de fecha de vencimiento.
- **FORM**: Rechazado debido a un error de formulario.