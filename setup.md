# Quick Setup Guide

## Prerequisites
- .NET 8 SDK installed
- Node.js 18+ installed
- MongoDB running locally or access to MongoDB Atlas

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend/RealEstate.API
```

2. Restore packages:
```bash
dotnet restore
```

3. Update connection string in `appsettings.json` if needed:
```json
{
  "DatabaseSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDB"
  }
}
```

4. Run the API:
```bash
dotnet run
```

The API will be available at `https://localhost:7000` with Swagger documentation at `https://localhost:7000/swagger`

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Testing

### Backend Tests
```bash
cd backend/RealEstate.API.Tests
dotnet test
```

### Frontend Tests
```bash
npm test
```

## Sample Data

The application includes sample data that will be automatically seeded when you first run the backend. This includes:
- 5 sample property owners
- 12 sample properties with various price ranges and locations
- Real property images from Unsplash

## Features Available

### Backend API
- ✅ GET /api/properties - Get all properties
- ✅ GET /api/properties/search - Search with filters
- ✅ GET /api/properties/{id} - Get property by ID
- ✅ POST /api/properties - Create property
- ✅ PUT /api/properties/{id} - Update property
- ✅ DELETE /api/properties/{id} - Delete property

### Frontend
- ✅ Property listing with grid layout
- ✅ Advanced search and filtering
- ✅ Property details modal
- ✅ Pagination
- ✅ Responsive design
- ✅ Loading states and error handling

## Troubleshooting

### Common Issues

1. **CORS errors**: Make sure the backend is running and CORS is configured for `http://localhost:5173`

2. **MongoDB connection**: Ensure MongoDB is running locally or update the connection string for MongoDB Atlas

3. **Port conflicts**: The backend runs on port 7000 and frontend on 5173. Change these in the respective config files if needed

4. **Missing dependencies**: Run `npm install` in the root directory and `dotnet restore` in the backend directory

### Getting Help

- Check the main README.md for detailed documentation
- Review the API documentation at `/swagger` when the backend is running
- Check the browser console for frontend errors
- Check the backend console for API errors
