"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  MessageCircle,
  Linkedin,
  Youtube,
} from "lucide-react";

export default function ContactPage() {
  const contactDetails = [
    {
      label: "Contact person",
      value: "Ronish Dhakal",
      icon: <User className="text-blue-600 w-5 h-5" />,
    },
    {
      label: "Email",
      value: "info@abroadadvise.com",
      icon: <Mail className="text-blue-600 w-5 h-5" />,
    },
    {
      label: "Phone Number",
      value: "+977 9845362017",
      icon: <Phone className="text-blue-600 w-5 h-5" />,
    },
    {
      label: "Location",
      value: "Kirtipur -10, Kathmandu",
      icon: <MapPin className="text-blue-600 w-5 h-5" />,
    },
  ];

  const socials = [
    { icon: <Facebook size={18} />, link: "#" },
    { icon: <Twitter size={18} />, link: "#" },
    { icon: <MessageCircle size={18} />, link: "#" },
    { icon: <Linkedin size={18} />, link: "#" },
    { icon: <Youtube size={18} />, link: "#" },
  ];

  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-md">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8">
            Contact Information
          </h2>

          <div className="space-y-6">
            {contactDetails.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-base text-gray-800 font-medium">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="mt-10 flex items-center gap-4">
            {socials.map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
