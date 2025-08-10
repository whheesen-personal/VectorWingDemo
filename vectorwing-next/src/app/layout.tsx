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
      <body>
        <ThemeRegistry>
          <AppStoreProvider>{children}</AppStoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}


