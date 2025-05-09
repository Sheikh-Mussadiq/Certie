import { Leaf, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube, ArrowRight, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { GiLindenLeaf } from "react-icons/gi";
import { TbLeaf2 } from "react-icons/tb";
const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-50 text-primary-800 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 opacity-5">
        <GiLindenLeaf className="w-40 h-40 text-primary-700" />
      </div>
      <div className="absolute -bottom-10 -left-10 opacity-5">
        <TbLeaf2 className="w-32 h-32 text-primary-700 rotate-45" />
      </div>

      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        {/* <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-primary-100 mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <Leaf className="w-32 h-32 text-primary-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-primary-800 mb-2">Join Our Green Community</h3>
              <p className="text-primary-600 mb-4">
                Get plant care tips, exclusive offers, and early access to new features.
              </p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                  Subscribe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-primary-700">FloraSense</span>
            </div>
            <p className="text-primary-600 mb-6">
              Your ultimate plant companion for identifying, tracking, and nurturing your green friends.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, name: "facebook" },
                { icon: Twitter, name: "twitter" },
                { icon: Instagram, name: "instagram" },
                { icon: Youtube, name: "youtube" },
              ].map(({ icon: Icon, name }) => (
                <a
                  key={name}
                  href="#"
                  className="text-primary-500 hover:text-primary-700 transition-colors"
                  aria-label={`Visit our ${name} page`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-primary-700">Explore</h3>
            <ul className="space-y-3">
              {[
                { name: "Plant Identification", path: "/search" },
                { name: "Care Guides", path: "/guides" },
                { name: "Plant Library", path: "/library" },
                { name: "Community", path: "/community" },
                { name: "Premium Features", path: "/premium" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-600 hover:text-primary-800 hover:underline transition-colors inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-primary-700">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "Plant Care Blog", path: "/blog" },
                { name: "Seasonal Tips", path: "/tips" },
                { name: "Troubleshooting", path: "/help" },
                { name: "Indoor Gardening", path: "/indoor" },
                { name: "Outdoor Plants", path: "/outdoor" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-600 hover:text-primary-800 hover:underline  transition-colors inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-primary-700">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-primary-600">123 Green Street, Plant City, Earth 98765</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                <span className="text-primary-600">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                <span className="text-primary-600">hello@florasense.com</span>
              </li>
              <li className="pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 bg-primary-100 hover:bg-primary-700 hover:text-primary-300  text-primary-700 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send us a message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} FloraSense. All rights reserved. Made with{" "}
            <Heart className="w-3 h-3 inline text-red-500 mx-1" /> for plant lovers.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/privacy" className="text-primary-500 hover:text-primary-700 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-500 hover:text-primary-700 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/accessibility" className="text-primary-500 hover:text-primary-700 text-sm transition-colors">
              Accessibility
            </Link>
            <Link to="/sitemap" className="text-primary-500 hover:text-primary-700 text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

