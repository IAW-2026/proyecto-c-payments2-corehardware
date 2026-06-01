[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/hMa_WFnH)
# CoreHardware - Payments

Aplicación **Payments** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `CoreHardware`.

Esta app corresponde al módulo de pagos en los proyectos de tipo **A (Transporte)**, **B (Delivery)** y **C (Marketplace)**.

Enunciado completo: <https://iaw-2026.github.io/proyecto/>

---

# Instrucciones

## Deploy

- Deploy en Vercel: https://proyecto-c-payments2-corehardware.vercel.app/


## Credenciales de prueba

### Users de clerk

- Admin: admin1+clerk_test@example.com
- Comprador1: buyer1+clerk_test@example.com
- Comprador2: buyer2+clerk_test@example.com
- Vendedor1: seller1+clerk_test@example.com
- Vendedor2: seller2+clerk_test@example.com

Para loguearse ingresar el mail y cuando pida contraseña seleccionar ingresar de otro modo. Seleccionar por codigo de confirmacion enviado al mail, e ingresar **424242**

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
