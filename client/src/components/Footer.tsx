import { Mail, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiLinkedin } from "react-icons/si";

export default function Footer() {
  const quickLinks = [
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Subscription", href: "/subscription" },
    { label: "Our Blog", href: "/blog" },
    { label: "FAQs", href: "/faq" },
  ];

  const socialLinks = [
    { icon: SiFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: SiX, href: "https://x.com", label: "X" },
    { icon: SiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4 flex items-center" data-testid="footer-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mr-2">
                <path d="M8 8C8 5.79086 9.79086 4 12 4H20C22.2091 4 24 5.79086 24 8V24C24 26.2091 22.2091 28 20 28H12C9.79086 28 8 26.2091 8 24V8Z" fill="#B078C4"/>
                <path d="M12 12H20M12 16H18M12 20H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" data-testid="text-quick-links">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                    data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" data-testid="text-get-in-touch">Get in touch</h3>
            <div className="space-y-4">
              <a
                href="mailto:listariaofficial@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span>listariaofficial@gmail.com</span>
              </a>
              <a
                href="tel:+91"
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                data-testid="link-phone"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+91</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p data-testid="text-copyright">Copyright &copy; Listaria 2025. All Rights Reserved</p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-primary transition-colors" data-testid="link-privacy">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors" data-testid="link-terms">
                Terms & Conditions
              </a>
              <a href="/refund" className="hover:text-primary transition-colors" data-testid="link-refund">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
