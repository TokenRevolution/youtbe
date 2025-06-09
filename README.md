# YouTube Channel Scanner

A modern web application that helps you search and filter YouTube channels based on subscriber counts and other criteria. Built with React, TypeScript, and Material-UI.

## Features

- Search YouTube channels in real-time
- Filter channels by subscriber count
- Modern, responsive UI with Material-UI components
- Real-time data from YouTube API
- Type-safe development with TypeScript

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- A YouTube Data API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-channel-scanner.git
cd youtube-channel-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your YouTube API key:
```
VITE_YOUTUBE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project is configured for deployment on Netlify. The deployment process is automatic when pushing to the main branch.

## Environment Variables

- `VITE_YOUTUBE_API_KEY`: Your YouTube Data API key (required)

## Technologies Used

- React
- TypeScript
- Vite
- Material-UI
- YouTube Data API v3

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
