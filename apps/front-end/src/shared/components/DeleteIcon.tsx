import { useState } from 'react';

interface DeleteIconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

function DeleteIcon({ 
  className = '', 
  width = 18, 
  height = 18, 
  color = 'currentColor' 
}: DeleteIconProps) {
  const [imageError, setImageError] = useState(false);

  // Tentar carregar imagem do ícone de excluir, se existir
  const deleteIconSrc = '/delete-icon.png';

  // Se a imagem existir, usar ela; caso contrário, usar SVG
  if (!imageError) {
    return (
      <img
        src={deleteIconSrc}
        alt="Excluir"
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
        d="M3 6h18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11v6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default DeleteIcon;

