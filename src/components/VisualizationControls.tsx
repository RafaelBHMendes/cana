import React from 'react'

interface VisualizationControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  canGoNext: boolean
  canGoPrevious: boolean
  onNext: () => void
  onPrevious: () => void
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  onGoToStep: (step: number) => void
}

export const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onGoToStep
}) => {
  const speedOptions = [
    { value: 2000, label: '0.5x' },
    { value: 1500, label: '0.75x' },
    { value: 1000, label: '1x' },
    { value: 750, label: '1.25x' },
    { value: 500, label: '2x' },
    { value: 250, label: '4x' }
  ]

  return (
    <div className='bg-base-200 p-4 rounded-lg space-y-4'>
      {/* Progresso */}
      <div className='space-y-2'>
        <div className='flex justify-between text-sm text-base-content/70'>
          <span>
            Passo {currentStep + 1} de {totalSteps}
          </span>
          <span>{totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0}%</span>
        </div>
        <div className='w-full'>
          <input
            type='range'
            min='0'
            max={totalSteps - 1}
            value={currentStep}
            onChange={e => onGoToStep(parseInt(e.target.value))}
            className='range range-primary w-full'
          />
          <div className='w-full flex justify-between text-xs px-2 text-base-content/50'>
            <span>0</span>
            <span>{totalSteps - 1}</span>
          </div>
        </div>
      </div>

      {/* Controles principais */}
      <div className='flex justify-center items-center gap-2'>
        <button onClick={onReset} className='btn btn-outline btn-sm' disabled={currentStep === 0}>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            />
          </svg>
          Reiniciar
        </button>

        <button onClick={onPrevious} className='btn btn-primary btn-sm' disabled={!canGoPrevious}>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Anterior
        </button>

        <button onClick={isPlaying ? onPause : onPlay} className='btn btn-primary btn-sm px-6'>
          {isPlaying ? (
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          ) : (
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M8 5v14l11-7z' />
            </svg>
          )}
          {isPlaying ? 'Pausar' : 'Reproduzir'}
        </button>

        <button onClick={onNext} className='btn btn-primary btn-sm' disabled={!canGoNext}>
          Próximo
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      {/* Controle de velocidade */}
      <div className='flex items-center justify-center gap-4'>
        <span className='text-sm text-base-content/70'>Velocidade:</span>
        <div className='flex gap-1'>
          {speedOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSpeedChange(option.value)}
              className={`btn btn-xs ${speed === option.value ? 'btn-primary' : 'btn-outline'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Informações de estado */}
      <div className='flex justify-center gap-4 text-xs text-base-content/50'>
        {isPlaying && (
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-success rounded-full animate-pulse'></div>
            <span>Reproduzindo</span>
          </div>
        )}
        <span>Velocidade: {speedOptions.find(o => o.value === speed)?.label || '1x'}</span>
      </div>
    </div>
  )
}
