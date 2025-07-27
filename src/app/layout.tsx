import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "QuizMaker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
