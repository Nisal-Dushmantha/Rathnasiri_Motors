# Bike Update Functionality

## Overview
This project now includes a complete frontend and backend system for updating both new and used bike information, specifically focusing on price, offers, and status updates.

## Features

### Backend Updates
- **Fixed Update Controller**: The `updatenewB` function in `BACKEND/controllers/newBController.js` now properly handles bike updates
- **Improved Error Handling**: Better error responses and validation
- **File Upload Support**: Maintains image upload functionality during updates

### Frontend Updates
- **New Bike Update Component**: `frontend/src/compononets/UpdateNewBike/UpdateNewBike.js` provides a user-friendly interface
- **Used Bike Update Component**: `frontend/src/compononets/UpdateUsedBike/UpdateUsedBike.js` provides a user-friendly interface for used bikes
- **Form Fields for New Bikes**: 
  - Type (text input)
  - Model (text input)
  - Color (text input)
  - Price (text input) - **Focus area for updates**
  - Offers (text input) - **Focus area for updates**
  - Status (dropdown) - **Focus area for updates**
  - Image (file upload with preview)
- **Form Fields for Used Bikes**:
  - Type (text input)
  - Model (text input)
  - Color (text input)
  - Price (text input) - **Focus area for updates**
  - Mileage (text input)
  - Year (text input)
  - Previous Owner (text input)
  - Status (dropdown) - **Focus area for updates**
  - Image (file upload with preview)
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Validation**: Form validation and error handling

## Routes

### Backend Routes
- `PUT /newBs/:id` - Update new bike by ID
- `PUT /usedBs/:id` - Update used bike by ID

### Frontend Routes
- `/UpdateNewBike/:id` - Update new bike form page
- `/UpdateUsedBike/:id` - Update used bike form page

## How to Use

### For New Bikes:
1. **Navigate to New Bikes**: Go to `/NewBikes` in the frontend
2. **Click Edit**: Click the "Edit" button on any bike card
3. **Update Fields**: Modify the price, offers, and status as needed
4. **Submit**: Click "Update Bike" to save changes
5. **Redirect**: You'll be redirected back to the bikes list

### For Used Bikes:
1. **Navigate to Used Bikes**: Go to `/UsedBikes` in the frontend
2. **Click Edit**: Click the "Edit" button on any bike card
3. **Update Fields**: Modify the price, status, mileage, year, and owner as needed
4. **Submit**: Click "Update Used Bike" to save changes
5. **Redirect**: You'll be redirected back to the bikes list

## API Endpoints

### Update New Bike
```
PUT http://localhost:5000/newBs/:id
Content-Type: multipart/form-data

Fields:
- type: string (required)
- model: string (required)
- color: string (required)
- price: string (required) - Updated field
- offers: string (required) - Updated field
- status: string (required) - Updated field
- image: file (optional)
```

### Update Used Bike
```
PUT http://localhost:5000/usedBs/:id
Content-Type: multipart/form-data

Fields:
- type: string (required)
- model: string (required)
- color: string (required)
- price: string (required) - Updated field
- mileage: string (required)
- year: string (required)
- owner: string (required)
- status: string (required) - Updated field
- image: file (optional)
```

## Status Options
- Available
- Sold
- Reserved
- Under Maintenance

## Technical Details

### Dependencies
- Frontend: React, React Router, Axios, Tailwind CSS
- Backend: Express, Mongoose, Multer

### File Structure
```
frontend/src/compononets/UpdateNewBike/
├── UpdateNewBike.js

frontend/src/compononets/UpdateUsedBike/
├── UpdateUsedBike.js

BACKEND/
├── controllers/newBController.js
├── controllers/usedBController.js
├── Routes/newBRoutes.js
├── Routes/usedBRoutes.js
├── Model/newBModel.js
└── Model/usedBModel.js
```

### Database Schema
The bike models include all necessary fields for updates:

**New Bike Model:**
- type, model, color, price, offers, status, image

**Used Bike Model:**
- type, model, color, price, mileage, year, owner, status, image

## Error Handling
- Form validation on frontend
- Proper HTTP status codes on backend
- User-friendly error messages
- Loading states and success feedback

## Future Enhancements
- Bulk update functionality
- Price history tracking
- Offer expiration dates
- Status change notifications
