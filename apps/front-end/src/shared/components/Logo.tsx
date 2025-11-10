import { useState } from 'react';
import './Logo.css';

interface LogoProps {
  className?: string;
  height?: number;
}

function Logo({ className = '', height = 40 }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Caminho da imagem do logo
  // Se a imagem estiver na pasta public, use '/teddy-logo.png'
  // Se estiver em src/assets/images, use o import
  const logoSrc = '/teddy-logo.png';

  return (
    <div className={`logo-container ${className}`}>
      {!imageError ? (
        <img 
          src={logoSrc}
          alt="Teddy Open Finance" 
          className="logo-image"
          style={{ height: `${height}px` }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="logo logo-fallback">
          <span className="logo-primary">Teddy</span>
          <span className="logo-secondary">Open Finance</span>
        </div>
      )}
    </div>
  );
}

export default Logo;

