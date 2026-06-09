export default function Footer() {
  return (
    <footer id="contact" className="glass py-20 px-6 text-center">
      
      {/* Title */}
      <h2 className="serif text-4xl mb-6">Visit Our Boutique</h2>

      {/* Description */}
      <p className="text-gray-500 mb-10 max-w-md mx-auto">
        Experience the artistry in person. Open Monday to Saturday, 10 AM — 8 PM.
      </p>

      {/* Links */}
      <div className="flex justify-center space-x-8">
        <a
          href="https://www.instagram.com/_lolakk_by_athira?igsh=MWFodHNtZ3BpM2JyNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase hover:text-amber-400 transition"
        >
          Instagram
        </a>

        <a
          href="https://maps.app.goo.gl/VHYug3drkWtcq6MU9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase hover:text-amber-400 transition"
        >
          Directions
        </a>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase hover:text-amber-400 transition"
        >
          WhatsApp
        </a>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 text-xs text-gray-600">
        © {new Date().getFullYear()} Lolakk Fine Jewelry • Kerala, India
      </div>

    </footer>
  );
}