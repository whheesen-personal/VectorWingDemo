import './globals.css';
import ThemeRegistry from '../components/ThemeRegistry';
import { AppStoreProvider } from '../state/store';

export const metadata = {
  title: "VectorWing Scheduler",
  description: "Next-gen flight scheduling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkfNWP1t6rNqIYbQxWQugZQVRcQ5v7G7q4Z0dZ7rK2bS5VQwqYQ8QK2Ig=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <ThemeRegistry>
          <AppStoreProvider>{children}</AppStoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}


