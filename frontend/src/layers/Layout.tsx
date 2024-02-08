import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="mx-auto w-4/5 py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
