# Restaurant Review App - Replit Development Guide

## Overview

This is a full-stack restaurant review application built with React, Express, and PostgreSQL. The app allows users to browse restaurants, read and write reviews, bookmark favorites, and search for restaurants by location and cuisine type. The application features a mobile-first design with Japanese UI elements, suggesting it's designed for the Japanese market.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for fast development and optimized production builds
- **Mobile-First Design**: Responsive layout with bottom navigation for mobile devices

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Cookie-based user identification (no traditional auth)
- **API Design**: RESTful API endpoints under `/api` prefix

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared TypeScript types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Database Schema
The application uses four main database tables:
- **restaurants**: Core restaurant information including name, genre, location, hours, and features
- **reviews**: User reviews with ratings and comments, linked to restaurants
- **bookmarks**: User favorite restaurants for quick access
- **menu_items**: Restaurant menu items with pricing and popularity flags

### Authentication Strategy
- Uses cookie-based user identification instead of traditional authentication
- Each user gets a unique cookie identifier for session management
- No passwords or personal information required - optimized for quick anonymous usage

### API Endpoints
- `GET/POST /api/restaurants` - Restaurant listing and creation
- `GET/POST /api/reviews` - Review management
- `GET/POST/DELETE /api/bookmarks` - Bookmark functionality
- `GET /api/menu-items` - Menu item retrieval

### UI Components
- Mobile-responsive design with bottom navigation
- Restaurant cards with ratings, bookmarks, and quick actions
- Review modal for adding/editing reviews
- Search functionality with genre filtering
- Map integration placeholder for location-based features

## Data Flow

1. **User visits app**: Automatic cookie generation for session tracking
2. **Browse restaurants**: API fetches restaurant data with user-specific bookmark status
3. **Search/Filter**: Dynamic filtering by cuisine type and text search
4. **View details**: Restaurant detail page with reviews and menu items
5. **Add reviews**: Modal form submission with real-time UI updates
6. **Bookmark management**: Toggle favorites with instant feedback

## External Dependencies

### Frontend Dependencies
- **UI Components**: Comprehensive set of Radix UI primitives via shadcn/ui
- **State Management**: TanStack Query for server state synchronization
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React icon library

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL adapter
- **Validation**: Zod schemas for API input validation
- **Session Storage**: Cookie-based session management
- **Development**: tsx for TypeScript execution in development

### Build Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production backend
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend
- **Hot Reload**: Vite provides instant updates during development
- **Database**: Connects to Neon Database via DATABASE_URL environment variable

### Production Deployment
- **Build Process**: 
  1. `vite build` - Compiles React app to static files
  2. `esbuild` - Bundles Express server for Node.js production
- **Deployment Target**: Replit Autoscale for automatic scaling
- **Static Assets**: Frontend builds to `dist/public` directory
- **Server**: Express serves both API and static files in production

### Environment Configuration
- **Development**: NODE_ENV=development enables Vite middleware
- **Production**: NODE_ENV=production serves pre-built static files
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL connection

## Changelog

Changelog:
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.