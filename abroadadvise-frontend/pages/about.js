import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-blue-500 text-white p-4">
          <h2>About Page</h2>
          <p>Learn more about Abroad Advise and our mission to help students.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
}
