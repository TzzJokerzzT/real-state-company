# HTTPS Setup for Real Estate API

This document explains how to configure HTTPS for the Real Estate API backend.

## Current Configuration

The backend is now configured to use **only HTTPS** on port 7000:

- **API URL**: `https://localhost:7000/api`
- **Swagger UI**: `https://localhost:7000/swagger`
- **Frontend**: Configured to use HTTPS

## Implemented Security Configuration

### 1. Backend (ASP.NET Core)

- ✅ HTTPS only (port 7000)
- ✅ Forced redirection to HTTPS
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ CORS configured for HTTPS
- ✅ Development certificate configured

### 2. Frontend (React + Vite)

- ✅ Configured to use `https://localhost:7000/api`
- ✅ Timeout configured for better error handling

## Steps to Run

### 1. Configure Development Certificate

```bash
# Run the setup script
./setup-https.sh
```

Or manually:

```bash
cd backend/RealEstate.API
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

### 2. Run the Backend

```bash
cd backend/RealEstate.API
dotnet run
```

### 3. Run the Frontend

```bash
npm run dev
```

## Solution to "Not Secure" Problem

### Option 1: Accept the Certificate (Recommended for Development)

1. Open `https://localhost:7000/swagger` in your browser
2. You will see a security warning
3. Click on "Advanced"
4. Click on "Proceed to localhost (unsafe)"
5. The site will load correctly

### Option 2: Create a Valid Certificate (For Production)

For a production environment, you will need:

1. A valid SSL certificate from a trusted CA
2. Configure the real domain
3. Update the CORS configuration

## Verification

### Backend

- ✅ `https://localhost:7000/swagger` - Swagger UI should load
- ✅ `https://localhost:7000/api/properties` - Should return JSON data

### Frontend

- ✅ `http://localhost:5173` - The React app should load
- ✅ API calls should work without CORS errors

## Troubleshooting

### Error: "ERR_CERT_AUTHORITY_INVALID"

- **Solution**: Accept the certificate as described in Option 1

### Error: "ERR_CONNECTION_REFUSED"

- **Solution**: Make sure the backend is running on port 7000

### CORS Error

- **Solution**: Make sure the frontend is running on port 5173

## Modified Files

- `backend/RealEstate.API/Program.cs` - HTTPS and security configuration
- `backend/RealEstate.API/appsettings.json` - Kestrel configuration
- `backend/RealEstate.API/appsettings.Development.json` - Development configuration
- `backend/RealEstate.API/Properties/launchSettings.json` - Launch configuration
- `src/services/api.ts` - API client configuration
- `setup-https.sh` - Automatic setup script

## Important Notes

1. **Development Only**: This configuration is for local development. For production, use valid SSL certificates.

2. **Browser**: Some browsers may require you to manually accept the certificate.

3. **Firewall**: Make sure port 7000 is open in your local firewall.

4. **MongoDB**: The connection to MongoDB remains secure using the connection string with SSL.
