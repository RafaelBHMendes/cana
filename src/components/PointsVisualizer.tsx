import React from 'react'
import type { ClosestPairStep, Point } from '../types'

interface PointsVisualizerProps {
  step: ClosestPairStep
  width?: number
  height?: number
}

export const PointsVisualizer: React.FC<PointsVisualizerProps> = ({
  step,
  width = 400,
  height = 300
}) => {
  const padding = 20
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  // Calcular escalas
  const xValues = step.points.map(p => p.x)
  const yValues = step.points.map(p => p.y)
  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)
  const minY = Math.min(...yValues)
  const maxY = Math.max(...yValues)

  const xRange = maxX - minX || 1
  const yRange = maxY - minY || 1

  const scaleX = (x: number) => padding + ((x - minX) / xRange) * chartWidth
  const scaleY = (y: number) => height - padding - ((y - minY) / yRange) * chartHeight

  const getPointColor = (point: Point) => {
    if (step.currentPair?.some(p => p.id === point.id)) {
      return '#ef4444' // red
    }
    if (step.candidatePoints?.some(p => p.id === point.id)) {
      return '#f59e0b' // amber
    }
    if (step.leftPoints?.some(p => p.id === point.id)) {
      return '#3b82f6' // blue
    }
    if (step.rightPoints?.some(p => p.id === point.id)) {
      return '#10b981' // emerald
    }
    return '#6b7280' // gray
  }

  const calculateDistance = (p1: Point, p2: Point) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  return (
    <div className='w-full'>
      <div className='flex justify-center'>
        <svg width={width} height={height} className='border border-base-300 rounded-lg'>
          {/* Grade de fundo */}
          <defs>
            <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
              <path
                d='M 20 0 L 0 0 0 20'
                fill='none'
                stroke='currentColor'
                strokeWidth='0.5'
                opacity='0.1'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' />

          {/* Linha de divisão vertical */}
          {step.divisionLine !== undefined && (
            <line
              x1={scaleX(step.divisionLine)}
              y1={padding}
              x2={scaleX(step.divisionLine)}
              y2={height - padding}
              stroke='#dc2626'
              strokeWidth='2'
              strokeDasharray='5,5'
            />
          )}

          {/* Linha de conexão do par atual */}
          {step.currentPair && step.currentPair.length === 2 && (
            <line
              x1={scaleX(step.currentPair[0].x)}
              y1={scaleY(step.currentPair[0].y)}
              x2={scaleX(step.currentPair[1].x)}
              y2={scaleY(step.currentPair[1].y)}
              stroke='#ef4444'
              strokeWidth='2'
            />
          )}

          {/* Pontos */}
          {step.points.map(point => (
            <g key={point.id}>
              <circle
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r='6'
                fill={getPointColor(point)}
                stroke='#ffffff'
                strokeWidth='2'
                className='transition-all duration-300'
              />
              <text
                x={scaleX(point.x)}
                y={scaleY(point.y) - 10}
                textAnchor='middle'
                className='text-xs font-semibold fill-current'
                fill='currentColor'
              >
                {point.id}
              </text>
            </g>
          ))}

          {/* Eixos */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke='currentColor'
            strokeWidth='1'
            opacity='0.3'
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke='currentColor'
            strokeWidth='1'
            opacity='0.3'
          />
        </svg>
      </div>

      {/* Informações */}
      <div className='mt-4 text-center'>
        {step.minDistance !== undefined && (
          <div className='text-sm text-base-content'>
            <strong>Menor distância atual:</strong> {step.minDistance.toFixed(2)}
          </div>
        )}
        {step.currentPair && step.currentPair.length === 2 && (
          <div className='text-sm text-base-content/70'>
            Par: ({step.currentPair[0].x}, {step.currentPair[0].y}) - ({step.currentPair[1].x},{' '}
            {step.currentPair[1].y})
            <br />
            Distância: {calculateDistance(step.currentPair[0], step.currentPair[1]).toFixed(2)}
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className='flex flex-wrap justify-center gap-4 mt-4 text-xs'>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
          <span>Pontos</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
          <span>Lado esquerdo</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-emerald-500 rounded-full'></div>
          <span>Lado direito</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-amber-500 rounded-full'></div>
          <span>Candidatos</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-red-500 rounded-full'></div>
          <span>Par atual</span>
        </div>
        {step.divisionLine !== undefined && (
          <div className='flex items-center gap-1'>
            <div className='w-3 h-1 bg-red-600'></div>
            <span>Linha divisão</span>
          </div>
        )}
      </div>
    </div>
  )
}
