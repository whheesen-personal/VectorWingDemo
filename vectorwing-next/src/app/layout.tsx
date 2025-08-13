import './globals.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
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
      <head></head>
      <body>
        <ThemeRegistry>
          <AppStoreProvider>{children}</AppStoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}


