# API Tester

A modern, powerful, and aesthetically pleasing API testing tool built with React, TypeScript, and Vite. Designed to provide a premium user experience for testing REST APIs with a focus on speed and usability.

## 🚀 Features

- **Request Builder**: Support for common HTTP methods (GET, POST, PUT, DELETE, PATCH, etc.).
- **Response Visualizer**: syntax-highlighted JSON response viewer.
- **Performance Metrics**: Real-time request duration tracking (using `performance.now()`).
- **JSON Tools**: Built-in JSON formatter, minifier, and validator.
- **History Management**: Automatically saves request history to `localStorage` for easy access to past queries.
- **Response Export**: Export response data to JSON files.
- **Dark/Light Mode**: Fully themeable UI with a dedicated dark mode toggle.
- **Brand Identity**: Custom Navy Blue and White color scheme for a professional look.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Built with [Radix UI](https://www.radix-ui.com/) and [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: React Hooks
- **Utils**: `clsx`, `tailwind-merge`, `date-fns`

## 🏁 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd api-tester
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## 📜 Scripts

- `pnpm dev`: Starts the development server with HMR.
- `pnpm build`: Type-checks and builds the application for production.
- `pnpm lint`: Runs ESLint to check for code quality issues.
- `pnpm preview`: Locally preview the production build.

## 💡 Usage

1. **Enter URL**: Type the API endpoint you want to test in the URL bar.
2. **Select Method**: Choose the HTTP method (GET, POST, etc.) from the dropdown.
3. **Add Headers/Body**: Use the tabs to add request headers or a JSON body if required.
4. **Send Request**: Click "Send" to execute the request.
5. **View Response**: Analyze the response status, time, and JSON body in the response section.
6. **History**: Access previous requests from the history sidebar/panel to quickly re-run them.

## 🎨 Branding

The application follows a strict **Navy Blue & White** color palette to maintain consistency with the brand identity.

---

Built with ❤️ by Pelumi.
