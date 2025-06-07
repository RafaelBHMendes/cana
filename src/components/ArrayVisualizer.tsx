import React from 'react'
import type { SortingStep } from '../types'

interface ArrayVisualizerProps {
  step: SortingStep
  maxValue?: number
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ step, maxValue }) => {
  const max = maxValue || Math.max(...step.array)
  const getBarHeight = (value: number) => Math.max(20, (value / max) * 200)

  const getBarColor = (index: number) => {
    if (step.highlight?.includes(index)) {
      return 'bg-accent'
    }
    if (step.comparisons?.includes(index)) {
      return 'bg-warning'
    }
    if (step.pivotIndex === index) {
      return 'bg-error'
    }
    if (step.merging && index >= step.left && index <= step.right) {
      return 'bg-success'
    }
    return 'bg-primary'
  }

  const getBarLabel = (index: number) => {
    if (step.pivotIndex === index) return 'P'
    if (step.highlight?.includes(index)) return 'H'
    if (step.comparisons?.includes(index)) return 'C'
    return ''
  }

  return (
    <div className='w-full'>
      <div className='flex items-end justify-center gap-1 min-h-[220px] p-4'>
        {step.array.map((value, index) => (
          <div key={index} className='flex flex-col items-center gap-1'>
            <div className='text-xs font-semibold text-base-content'>{getBarLabel(index)}</div>
            <div
              className={`${getBarColor(
                index
              )} rounded-t-sm transition-all duration-300 min-w-[20px] relative flex items-end justify-center`}
              style={{ height: `${getBarHeight(value)}px` }}
            >
              <span className='text-xs font-bold text-base-100 mb-1'>{value}</span>
            </div>
            <div className='text-xs text-base-content/70'>{index}</div>
          </div>
        ))}
      </div>

      {/* Indicadores de faixa */}
      {step.left !== undefined && step.right !== undefined && (
        <div className='flex justify-center mt-2'>
          <div className='text-sm text-base-content/70'>
            Faixa ativa: [{step.left}..{step.right}]
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className='flex flex-wrap justify-center gap-4 mt-4 text-xs'>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-primary rounded'></div>
          <span>Normal</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-accent rounded'></div>
          <span>Destacado</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-warning rounded'></div>
          <span>Comparando</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-error rounded'></div>
          <span>Pivô</span>
        </div>
        {step.merging && (
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-success rounded'></div>
            <span>Merging</span>
          </div>
        )}
      </div>
    </div>
  )
}
