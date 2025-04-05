// client/src/components/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="vibrant-footer">
      <Container>
        <p className="text-center">
          © {new Date().getFullYear()} Hameed Latif Hospital. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;