# Concepto: JITTER

> Documento de diseño interno.
> Describe la intención, el modelo de amenazas y la lógica del laboratorio.

**JITTER** no es una máquina de explotación tradicional ni una colección de vulnerabilidades aisladas.  
Es una **anomalía de diseño** que expone cómo decisiones aparentemente razonables fallan bajo observación precisa.

> [!IMPORTANT]
> **Filosofía del Lab**  
> El sistema responde siempre de forma coherente y controlada (status 200, mensajes genéricos), pero es incapaz de ocultar dos cosas fundamentales:
> - El **esfuerzo computacional real** de sus operaciones.
> - La **fragilidad criptográfica** de sus supuestos de confianza.
>
> *En JITTER, el servidor miente en el contenido, pero dice la verdad en el tiempo.*

---

## Modelo de Vulnerabilidades (OWASP & CWE)

Las debilidades explotables en esta máquina se mapean directamente a estándares reconocidos:

- **[OWASP A07:2021]** – **Identification and Authentication Failures**  
  Errores en la protección contra enumeración de usuarios y ataques de fuerza bruta.

- **[CWE-208]** – **Observable Timing Discrepancy**  
  Diferencias medibles en el tiempo de procesamiento según datos sensibles.

- **[CWE-307]** – **Improper Restriction of Excessive Authentication Attempts**  
  Rate limiting vulnerable al uso de cabeceras de red controlables.

- **[CWE-345]** – **Insufficient Verification of Data Authenticity**  
  Confianza ciega en tokens JWT firmados con secretos débiles.

---

## Modelo de Ataque

El laboratorio prioriza la **observación, medición y control**, no la explotación directa.

### 1. Reconocimiento por Tiempo
El endpoint de autenticación devuelve siempre la misma respuesta lógica. Sin embargo, la validación de credenciales legítimas genera una discrepancia temporal observable. El tiempo de respuesta es el canal lateral de información.

### 2. Evasión de Controles
Al confiar en cabeceras controlables por el usuario, el sistema permite la rotación artificial de identidad. La automatización se vuelve un requisito operativo.

### 3. Escalación de Privilegios
El objetivo no son los datos, sino la clave que firma la identidad. Al romper el secreto del JWT, el atacante deja de pedir permisos y comienza a definirlos.

---

> [!NOTE]
> Esta máquina no requiere exploits públicos. El desafío es explotar las consecuencias inevitables de malas suposiciones de diseño.

---

## Stack de la Máquina

- **Backend**: Node.js + Express (SSR para ocultar lógica).
- **Base de Datos**: Better-SQLite3 (Persistencia minimalista).
- **Seguridad**:
  - **JWT**: HS256 con secreto débil (vulnerable a fuerza bruta).
  - **Hashing**: Bcrypt (el motor detrás del timing attack).

---

> _"El ruido es solo una máscara; el tiempo es la verdad."_
