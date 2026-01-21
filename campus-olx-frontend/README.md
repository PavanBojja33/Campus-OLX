# Campus OLX Frontend

A production-grade React frontend for the Campus OLX marketplace application.

## Features

- ✅ **JWT Authentication** - Secure login and signup with token-based auth
- ✅ **Modern UI/UX** - Clean, responsive design with OLX-style interface
- ✅ **Dark Mode** - Full dark mode support with theme persistence
- ✅ **Item Management** - Add, edit, delete, mark as sold/removed
- ✅ **Search & Filters** - Search items, filter by category, department, semester
- ✅ **Sorting** - Sort by price (low to high, high to low) or latest
- ✅ **Pagination** - Efficient pagination for large item lists
- ✅ **Image Upload** - Multiple image uploads with preview
- ✅ **Toast Notifications** - User-friendly success/error notifications
- ✅ **Loading States** - Skeleton loaders and loading indicators
- ✅ **Error Handling** - Comprehensive error handling with user-friendly messages
- ✅ **Protected Routes** - Route protection based on authentication status
- ✅ **Responsive Design** - Mobile-first responsive design

## Tech Stack

- **React 19** - Latest React with hooks
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Vite** - Fast build tool and dev server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx      # Button component
│   ├── ItemCard.jsx    # Item card component
│   ├── ItemSkeleton.jsx # Loading skeleton
│   ├── Loader.jsx      # Spinner loader
│   ├── Modal.jsx       # Modal dialog
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer component
│   └── ProtectedRoute.jsx # Route protection
├── context/            # React contexts
│   ├── AuthContext.jsx # Authentication context
│   └── ThemeContext.jsx # Dark mode theme context
├── pages/              # Page components
│   ├── Landing.jsx     # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Signup page
│   ├── Marketplace.jsx # Marketplace/home page
│   ├── ItemDetails.jsx # Item detail page
│   ├── AddItem.jsx     # Add item page
│   ├── EditItem.jsx    # Edit item page
│   ├── Profile.jsx     # User profile page
│   └── NotFound.jsx    # 404 page
├── services/           # API services
│   └── api.js          # Axios instance and API functions
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
```bash
cd campus-olx-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root of the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, update this to your production API URL.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all active items (with filters, pagination)
- `GET /api/items/my` - Get current user's items
- `POST /api/items/add` - Add new item (multipart/form-data)
- `PUT /api/items/:id` - Update item
- `PUT /api/items/sold/:id` - Mark item as sold
- `PUT /api/items/remove/:id` - Remove item (soft delete)

### User
- `GET /api/user/profile` - Get user profile

## Features Overview

### Authentication Flow
1. User registers/logs in
2. JWT token is stored in localStorage
3. Token is automatically attached to API requests via Axios interceptor
4. Protected routes check authentication status
5. Token expiration is handled automatically

### Marketplace Page
- View all active items in a grid layout
- Search items by title/description
- Filter by category, department, semester
- Sort by price or date
- Pagination support
- Responsive grid (1-4 columns based on screen size)

### Item Details Page
- View full item details with image gallery
- Contact seller (shows seller email)
- Edit/Delete/Mark as Sold (if owner)
- Image navigation

### Profile Page
- View user stats (active/sold/removed items)
- Filter items by status (active/sold/removed)
- Quick actions (mark as sold, remove)
- Responsive card layout

### Dark Mode
- Toggle dark mode from navbar
- Theme preference saved in localStorage
- Smooth transitions between themes

## Styling

The app uses Tailwind CSS with custom configuration:
- Primary color: Blue (adjustable in `tailwind.config.js`)
- Dark mode: Class-based (`dark:` prefix)
- Responsive breakpoints: sm, md, lg, xl

## Best Practices Implemented

1. **Component Reusability** - Shared components (Button, Modal, Loader, etc.)
2. **Context API** - Centralized state management (Auth, Theme)
3. **Error Handling** - Try-catch blocks with user-friendly messages
4. **Loading States** - Loading indicators for async operations
5. **Form Validation** - Client-side validation before API calls
6. **Image Optimization** - Lazy loading and preview before upload
7. **Accessibility** - Semantic HTML and ARIA labels
8. **Code Organization** - Clear folder structure and separation of concerns

## Production Build

To build for production:

```bash
npm run build
```

The production build will be in the `dist/` directory. Deploy this to any static hosting service (Vercel, Netlify, AWS S3, etc.).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Ensure backend CORS is configured to allow requests from frontend origin
- Token is stored in localStorage (consider httpOnly cookies for production)
- Image uploads support up to 5 images per item
- Backend should handle file uploads via `multipart/form-data`

## Troubleshooting

**API requests failing?**
- Check that backend is running on the correct port
- Verify `VITE_API_BASE_URL` in `.env` file
- Check browser console for CORS errors

**Dark mode not working?**
- Clear localStorage and refresh
- Check browser console for JavaScript errors

**Images not loading?**
- Verify backend Cloudinary configuration
- Check image URLs in network tab

## License

MIT
