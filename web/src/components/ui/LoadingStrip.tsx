// LoadingStrip.tsx
// Componente React + TypeScript usando Tailwind CSS
// Uso: import LoadingStrip from './LoadingStrip'
// <LoadingStrip width="w-64" height="h-3" rounded="rounded-lg" />

type Props = {
  className?: string
  width?: string // classes tailwind como 'w-full' ou 'w-64'
  height?: string // classes tailwind como 'h-2' ou 'h-3'
  rounded?: string // classes tailwind como 'rounded-md' ou 'rounded-full'
  ariaLabel?: string
  disabled?: boolean
}


export default function LoadingStrip({
  className = '',
  width = 'w-full',
  height = 'h-3',
  rounded = 'rounded-md',
  ariaLabel = 'Carregando',
  disabled = false,
}: Props) {
  return (
    <div
      className={`${width} ${height} ${rounded} relative overflow-hidden ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
    {/* Retângulo transparente com borda sutil */}
    <div className="absolute inset-0 pointer-events-none bg-transparent border border-white/10" />


    {/* Faixa azul com gradiente e animação horizontal */}
    {!disabled && (
      <div
        className="absolute top-0 bottom-0 w-1/3 -left-1/3"
        style={{
          background:
            'linear-gradient(90deg, rgba(59,130,246,0.00) 0%, rgba(59,130,246,0.14) 30%, rgba(59,130,246,0.70) 50%, rgba(59,130,246,0.14) 70%, rgba(59,130,246,0.00) 100%)',
          animation: 'loading-strip-slide 1.6s linear infinite',
        }}
      />
    )}


    {/* Keyframes embutidos (não requer alteração na config do Tailwind) */}
    {!disabled && (
      <style>{`
        @keyframes loading-strip-slide {
          0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
      `}</style>
      )}
    </div>
  )
}