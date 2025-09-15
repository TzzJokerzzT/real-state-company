# HTTPS Setup for Real Estate API

Este documento explica cómo configurar HTTPS para el backend de la API de Real Estate.

## Configuración Actual

El backend ahora está configurado para usar **solo HTTPS** en el puerto 7000:

- **URL del API**: `https://localhost:7000/api`
- **Swagger UI**: `https://localhost:7000/swagger`
- **Frontend**: Configurado para usar HTTPS

## Configuración de Seguridad Implementada

### 1. Backend (ASP.NET Core)

- ✅ Solo HTTPS (puerto 7000)
- ✅ Redirección forzada a HTTPS
- ✅ Headers de seguridad (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ CORS configurado para HTTPS
- ✅ Certificado de desarrollo configurado

### 2. Frontend (React + Vite)

- ✅ Configurado para usar `https://localhost:7000/api`
- ✅ Timeout configurado para mejor manejo de errores

## Pasos para Ejecutar

### 1. Configurar Certificado de Desarrollo

```bash
# Ejecutar el script de configuración
./setup-https.sh
```

O manualmente:

```bash
cd backend/RealEstate.API
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

### 2. Ejecutar el Backend

```bash
cd backend/RealEstate.API
dotnet run
```

### 3. Ejecutar el Frontend

```bash
npm run dev
```

## Solución al Problema de "No Segura"

### Opción 1: Aceptar el Certificado (Recomendado para Desarrollo)

1. Abre `https://localhost:7000/swagger` en tu navegador
2. Verás una advertencia de seguridad
3. Haz clic en "Avanzado" o "Advanced"
4. Haz clic en "Proceder a localhost (no seguro)" o "Proceed to localhost (unsafe)"
5. El sitio se cargará correctamente

### Opción 2: Crear un Certificado Válido (Para Producción)

Para un entorno de producción, necesitarías:

1. Un certificado SSL válido de una CA confiable
2. Configurar el dominio real
3. Actualizar la configuración de CORS

## Verificación

### Backend

- ✅ `https://localhost:7000/swagger` - Debe cargar Swagger UI
- ✅ `https://localhost:7000/api/properties` - Debe devolver datos JSON

### Frontend

- ✅ `http://localhost:5173` - Debe cargar la aplicación React
- ✅ Las llamadas a la API deben funcionar sin errores CORS

## Troubleshooting

### Error: "ERR_CERT_AUTHORITY_INVALID"

- **Solución**: Acepta el certificado como se describe en la Opción 1

### Error: "ERR_CONNECTION_REFUSED"

- **Solución**: Verifica que el backend esté ejecutándose en el puerto 7000

### Error de CORS

- **Solución**: Verifica que el frontend esté ejecutándose en el puerto 5173

## Archivos Modificados

- `backend/RealEstate.API/Program.cs` - Configuración HTTPS y seguridad
- `backend/RealEstate.API/appsettings.json` - Configuración Kestrel
- `backend/RealEstate.API/appsettings.Development.json` - Configuración de desarrollo
- `backend/RealEstate.API/Properties/launchSettings.json` - Configuración de lanzamiento
- `src/services/api.ts` - Configuración del cliente API
- `setup-https.sh` - Script de configuración automática

## Notas Importantes

1. **Solo para Desarrollo**: Esta configuración es para desarrollo local. Para producción, usa certificados SSL válidos.

2. **Navegador**: Algunos navegadores pueden requerir que aceptes el certificado manualmente.

3. **Firewall**: Asegúrate de que el puerto 7000 esté abierto en tu firewall local.

4. **MongoDB**: La conexión a MongoDB sigue siendo segura usando la cadena de conexión con SSL.
