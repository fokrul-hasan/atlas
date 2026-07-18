export default function Footer() {
  return (
    <footer className="footer-band">
      <div className="wrap">
        <div className="footer-row">
          <div className="brand">Fokrul Hasan</div>
          <div className="footer-links">
            <a href="mailto:fokrul.hh@gmail.com">Email</a>
            <a href="https://www.facebook.com/HridoyHsn" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a
              href="https://www.goodreads.com/user/show/98267013-md-fokrul"
              target="_blank"
              rel="noopener noreferrer"
            >
              Goodreads
            </a>
          </div>
        </div>
        <p className="footer-note">A personal library, not a portfolio. © {new Date().getFullYear()} Fokrul Hasan.</p>
      </div>
    </footer>
  );
}
