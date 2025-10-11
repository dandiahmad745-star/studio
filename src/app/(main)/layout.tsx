
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
