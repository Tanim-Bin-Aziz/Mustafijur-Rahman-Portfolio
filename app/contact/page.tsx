import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactSection from "@/components/Contact"; // tomar existing component path

export default function ContactPage() {
  return (
    <>
      <Nav />
      <div className="mt-8">
        <ContactSection />
      </div>
      <Footer />
    </>
  );
}
