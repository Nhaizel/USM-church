# USM Church Website

A modern, accessible, and performant church website built with vanilla JavaScript, following principal engineering best practices. Features dynamic YouTube video integration, event listings, and responsive design.

## ✨ Features

- **🎨 Modern Design** - Clean, professional interface with smooth animations
- **📱 Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **♿ Accessible** - WCAG 2.1 Level AA compliant
- **⚡ High Performance** - Lazy loading, caching, and optimization
- **🎥 YouTube Integration** - Automatically displays latest 8 videos from your channel
- **🏗️ Modular Architecture** - ES6 modules with clear separation of concerns
- **🔒 Secure** - XSS prevention, input sanitization, security best practices
- **📊 SEO Optimized** - Semantic HTML, Open Graph tags, structured data

## 🚀 Quick Start

### Prerequisites

- A modern web browser
- A local web server (Python, Node.js, or any HTTP server)
- YouTube Data API key (see [YOUTUBE_SETUP.md](YOUTUBE_SETUP.md))

### Installation

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/usmchurch/website.git
   cd website
   ```

2. **Get a YouTube API Key**
   - Follow the detailed instructions in [YOUTUBE_SETUP.md](YOUTUBE_SETUP.md)
   - Takes about 5-10 minutes

3. **Configure the API Key**
   - Open `js/config.js`
   - Replace `YOUR_API_KEY` with your actual YouTube API key:
   ```javascript
   youtube: {
     apiKey: 'YOUR_YOUTUBE_API_KEY_HERE',
     // ...
   }
   ```

4. **Serve the website locally**
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using Node.js
   npx serve

   # Using PHP
   php -S localhost:8000
   ```

5. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Videos should load automatically in the YouTube section

## 📁 Project Structure

```
USM-Church/
├── index.html                 # Main HTML file
├── style.css                  # Stylesheet
├── js/
│   ├── main.js               # Application entry point
│   ├── config.js             # Configuration
│   ├── components/           # UI components
│   │   ├── Navigation.js
│   │   └── YouTubeGallery.js
│   ├── services/             # API services
│   │   └── youtubeService.js
│   └── utils/                # Utilities
│       ├── logger.js
│       ├── cache.js
│       └── dom.js
├── images/                    # Image assets
├── ARCHITECTURE.md            # Architecture documentation
├── YOUTUBE_SETUP.md           # API setup guide
├── CONTRIBUTING.md            # Contribution guidelines
├── CHANGELOG.md               # Version history
└── README.md                  # This file
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## 💡 Usage

### Customization

#### Changing Colors
Edit CSS variables in `style.css`:
```css
:root {
  --color-primary: rgb(186, 11, 11);
  --color-primary-dark: rgb(153, 23, 23);
  /* ... more variables */
}
```

#### Updating Content
- **Events**: Edit the event cards in `index.html` (search for `class="category"`)
- **About**: Update mission text in `index.html` (search for `id="about"`)
- **Contact**: Modify footer information in `index.html` (search for `<footer>`)

#### Configuring YouTube
- **Video Count**: Change `maxResults` in `js/config.js`
- **Channel**: Update `channelUsername` in `js/config.js`
- **Cache Duration**: Modify `cacheTimeout` in `js/config.js`

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub
2. Go to Settings > Pages
3. Select main branch
4. Your site will be live at `https://username.github.io/repo-name`

### Netlify
1. Connect your GitHub repository
2. Set build command: (none needed for static site)
3. Set publish directory: `/`
4. Deploy!

### Custom Domain
1. Add a CNAME file with your domain
2. Configure DNS settings with your provider
3. Update Open Graph URLs in HTML

For detailed deployment instructions, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 📖 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture and design decisions
- **[YOUTUBE_SETUP.md](YOUTUBE_SETUP.md)** - YouTube API setup guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

## 🏗️ Architecture Highlights

### Modular Structure
- **Configuration Layer**: Centralized settings in `js/config.js`
- **Service Layer**: API interactions with retry logic and caching
- **Component Layer**: Reusable UI components
- **Utility Layer**: Common helpers (DOM, logging, caching)

### Key Patterns
- **ES6 Modules**: Clean imports/exports
- **Separation of Concerns**: Each file has one responsibility
- **Error Resilience**: Retry logic, fallbacks, user-friendly errors
- **Performance**: Caching, lazy loading, debouncing
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'feat: Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🐛 Troubleshooting

### Videos Not Loading?
1. Check browser console for errors (F12)
2. Verify API key in `js/config.js`
3. Ensure YouTube Data API v3 is enabled
4. Check API quota hasn't been exceeded
5. See [YOUTUBE_SETUP.md](YOUTUBE_SETUP.md) for detailed troubleshooting

### Navigation Not Working?
1. Check browser console for JavaScript errors
2. Ensure `js/main.js` is loaded as a module
3. Clear browser cache
4. Try in incognito mode

### Styling Issues?
1. Hard refresh (Ctrl/Cmd + Shift + R)
2. Clear browser cache
3. Check `style.css` is loaded correctly
4. Verify no CSS conflicts

## 📊 Performance

- **Caching**: API responses cached for 5 minutes
- **Lazy Loading**: Images load only when needed
- **Retry Logic**: Automatic retry for failed API calls
- **Debouncing**: Optimized scroll handlers
- **Resource Hints**: Preconnect to external domains

## 🔐 Security

### Current Implementation
- XSS prevention through HTML sanitization
- Secure external links (`rel="noopener noreferrer"`)
- Input validation
- Error handling without exposing sensitive data

### Production Recommendations
⚠️ **Important**:
- Move API key to serverless function or backend
- Implement Content Security Policy (CSP)
- Add rate limiting
- Regular security audits
- Enable HTTPS

## 🧪 Testing

### Manual Testing Checklist
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Different screen sizes
- [ ] Keyboard navigation
- [ ] Screen reader (NVDA, VoiceOver)
- [ ] Performance (Lighthouse score)
- [ ] No console errors

### Recommended Testing Tools
- **Lighthouse** - Performance and accessibility audit
- **axe DevTools** - Accessibility testing
- **WAVE** - Web accessibility evaluation

## 📝 Code Quality

### Tools Used
- Semantic HTML5
- CSS custom properties (variables)
- ES6+ JavaScript
- JSDoc comments
- Consistent naming conventions

### Best Practices
- Mobile-first responsive design
- Progressive enhancement
- Error boundaries
- Graceful degradation
- Accessibility first

## 📦 Technologies

- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, Custom Properties
- **JavaScript ES6+** - Modules, async/await, classes
- **YouTube Data API v3** - Video integration
- **Google Fonts** - Poppins font family
- **Font Awesome** - Social media icons

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS 12+, Android 5+)

## 📈 Performance Metrics

Target metrics (via Lighthouse):
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

## 🔄 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 📄 License

© 2025 USM Church. All rights reserved.

## 💬 Support

- **Documentation**: See documentation files in repository
- **Issues**: [GitHub Issues](https://github.com/usmchurch/website/issues)
- **Email**: info@usmchurch.org

## 🙏 Acknowledgments

- Google Fonts for Poppins font
- Font Awesome for icons
- YouTube Data API for video integration
- The open-source community

---

**Built with ❤️ following principal engineering best practices**

