import { useState } from 'react';

interface EditIconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

function EditIcon({ 
  className = '', 
  width = 18, 
  height = 18, 
  color = 'currentColor' 
}: EditIconProps) {
  const [imageError, setImageError] = useState(false);

  // Tentar carregar imagem do ícone de editar, se existir
  const editIconSrc = '/edit-icon.png';

  // Se a imagem existir, usar ela; caso contrário, usar SVG
  if (!imageError) {
    return (
      <img
        src={editIconSrc}
        alt="Editar"
        className={className}
        style={{ width: `${width}px`, height: `${height}px`, objectFit: 'contain' }}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback para SVG se a imagem não existir
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default EditIcon;

