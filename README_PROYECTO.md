# Prueba Técnica - Sistema de Transacciones Bancarias

## 📋 Descripción General

Aplicación web Angular moderna para gestionar transacciones bancarias. Permite crear transacciones (depósitos/retiros) y consultar saldos de cuentas. La aplicación utiliza una arquitectura escalable basada en componentes standalone, servicios inyectables y principios SOLID.

**Versiones:**
- Angular 21.2.0
- RxJS 7.8.0
- Tailwind CSS 4.3.1
- TypeScript 5.9.2

---

## 🏗️ Estructura del Proyecto

```
PruebaTecnica/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       ├── account.service.ts       # Servicio para cuentas
│   │   │       └── transaction.service.ts   # Servicio para transacciones
│   │   ├── model/
│   │   │   ├── account.model.ts             # Interfaz de Cuenta
│   │   │   └── transaction.model.ts         # Interfaces de Transacción
│   │   ├── feautures/
│   │   │   ├── transaction-form/
│   │   │   │   ├── transaction-form.ts      # Componente formulario
│   │   │   │   ├── transaction-form.html    # Template formulario
│   │   │   │   └── transaction-form.css     # Estilos
│   │   │   └── account-detail/
│   │   │       ├── account-detail.ts        # Componente detalle cuenta
│   │   │       ├── account-detail.html      # Template detalle
│   │   │       └── account-detail.css       # Estilos
│   │   ├── app.ts                           # Componente raíz
│   │   ├── app.html                         # Template raíz
│   │   ├── app.routes.ts                    # Definición de rutas
│   │   ├── app.config.ts                    # Configuración de la app
│   │   └── environments/
│   │       └── environment.ts               # Configuración de entorno
│   ├── main.ts                              # Punto de entrada
│   ├── index.html                           # HTML base
│   └── styles.css                           # Estilos globales
├── angular.json                             # Configuración Angular CLI
├── tsconfig.json                            # Configuración TypeScript
├── tailwind.config.cjs                      # Configuración Tailwind
└── package.json                             # Dependencias npm
```

---

## 🚀 Instalación y Setup

### Requisitos Previos
- Node.js 18+ 
- npm 10.9.2+
- Backend ejecutándose en `http://localhost:8080`

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd PruebaTecnica
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
   - Editar `src/app/environments/environment.ts` si el backend está en otra URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api', // Cambiar si es necesario
   }
   ```

4. **Iniciar servidor de desarrollo**
```bash
npm start
```
   - La app se abre automáticamente en `http://localhost:4200`

5. **Build para producción**
```bash
npm run build
```

---

## 📱 Componentes Principales

### 1. **TransactionFormComponent**
**Ruta:** `/transactions/new`

Formulario reactivo para crear transacciones (depósitos o retiros).

**Funcionalidades:**
- Entrada de ID de cuenta, tipo de transacción y monto
- Validaciones en tiempo real
- Spinner de carga mientras se procesa la petición
- Visualización inmediata del resultado sin navegar
- Auto-scroll al bloque de confirmación

**Estados Visuales:**
- ✏️ Formulario con validaciones
- 📤 Bloque "Enviando..." mientras se realiza la petición
- ✅ Tarjeta de éxito con detalles de la transacción y saldo actual
- ❌ Mensaje de error si falla la petición

**Tecnologías usadas:**
- `ReactiveFormsModule` para validaciones reactivas
- `BehaviorSubject` (RxJS) para actualización reactiva de la UI
- `ChangeDetectorRef` para control explícito de detección de cambios
- Tailwind CSS para diseño responsive

---

### 2. **AccountDetailComponent**
**Ruta:** `/accounts/:id` (búsqueda manual)

Buscador de cuentas que permite consultar el saldo y detalles de una cuenta.

**Funcionalidades:**
- Input para buscar por ID de cuenta
- Búsqueda al presionar Enter o botón "Buscar"
- Validaciones: solo números positivos, botón deshabilitado si el input está vacío
- Visualización de saldo en formato moneda
- Manejo de errores con mensajes claros

**Estados Visuales:**
- 📝 Input de búsqueda con validaciones
- ⏳ Indicador de carga mientras se consulta
- 💰 Tarjeta con detalles de la cuenta (ID, número de cuenta, saldo)
- ❌ Mensaje de error si la cuenta no existe

**Tecnologías usadas:**
- `FormsModule` con `ngModel` para two-way binding
- Pipes: `CurrencyPipe` para formato de moneda
- `ChangeDetectorRef` para actualización de cambios

---

## 🔌 Endpoints Consumidos

### 1. Crear Transacción
**Método:** `POST`  
**URL:** `/api/transactions`  
**Body:**
```json
{
  "accountId": 1,
  "type": "DEPOSIT",
  "amount": 500
}
```
**Respuesta (200):**
```json
{
  "id": 3,
  "type": "DEPOSIT",
  "amount": 500,
  "createdAt": "2026-06-18T21:45:12.039175400Z",
  "account": {
    "id": 1,
    "accountNumber": "ACC-001",
    "balance": 1055.2
  }
}
```

### 2. Obtener Cuenta
**Método:** `GET`  
**URL:** `/api/accounts/{id}`  
**Respuesta (200):**
```json
{
  "id": 1,
  "accountNumber": "ACC-001",
  "balance": 1055.2
}
```

---

## 🎯 Principios SOLID Implementados

### 1. **S - Single Responsibility Principle (Responsabilidad Única)**

Cada componente y servicio tiene una única responsabilidad bien definida:

**Ejemplo - Servicios:**
```typescript
// AccountService: solo gestiona operaciones de cuentas
@Injectable({ providedIn: 'root' })
export class AccountService {
  getAccount(id: number): Observable<Account> { ... }
}

// TransactionService: solo gestiona operaciones de transacciones
@Injectable({ providedIn: 'root' })
export class TransactionService {
  createTransaction(body: TransactionRequest): Observable<TransactionResponse> { ... }
}
```

**Ejemplo - Componentes:**
- `TransactionFormComponent`: solo maneja crear transacciones
- `AccountDetailComponent`: solo consulta cuentas

### 2. **O - Open/Closed Principle (Abierto/Cerrado)**

Los servicios están abiertos para extensión pero cerrados para modificación:

```typescript
// Fácil de extender con nuevos métodos sin modificar lo existente
@Injectable({ providedIn: 'root' })
export class TransactionService {
  createTransaction(body: TransactionRequest): Observable<TransactionResponse> { ... }
  
  // Futuro: puedo añadir estos métodos sin afectar createTransaction
  getTransactionHistory(accountId: number): Observable<Transaction[]> { ... }
  cancelTransaction(id: number): Observable<void> { ... }
}
```

### 3. **L - Liskov Substitution Principle (Sustitución de Liskov)**

Los servicios cumplen un contrato (interfaz) y pueden ser reemplazados por implementaciones alternativas:

```typescript
// Los modelos definen el contrato de datos
export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
}

export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  createdAt: string;
  account: Account;
}

// Los servicios usan estos contratos
export class AccountService {
  getAccount(id: number): Observable<Account> { ... } // Retorna Account
}
```

### 4. **I - Interface Segregation Principle (Segregación de Interfaz)**

Las interfaces son específicas y no incluyen métodos innecesarios:

```typescript
// Interfaz compacta solo para peticiones
export interface TransactionRequest {
  accountId: number;
  type: TransactionType | string;
  amount: number;
}

// Interfaz separada para respuestas con más datos
export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  createdAt: string;
  account: Account;
}

// Enum para tipos seguros sin hardcode strings
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW'
}
```


## 📖 Guía de Uso

### Crear una Transacción
1. Navega a la sección "Nueva transacción"
2. Ingresa ID de cuenta, tipo (DEPOSIT/WITHDRAW) y monto
3. Presiona "Enviar"
4. Verás el estado "Enviando..." automáticamente
5. Una vez confirmada, se muestra la tarjeta con los detalles

### Consultar una Cuenta
1. Navega a la sección "Consultar Cuenta"
2. Ingresa el ID de la cuenta
3. Presiona "Buscar" o Enter
4. Se muestra el saldo actual en formato moneda
