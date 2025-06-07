import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useAlgorithmVisualization } from './hooks/useAlgorithmVisualization'
import { ArrayVisualizer } from './components/ArrayVisualizer'
import { PointsVisualizer } from './components/PointsVisualizer'
import { VisualizationControls } from './components/VisualizationControls'
import { MergeSortVisualizer } from './algorithms/mergeSort'
import { QuickSortVisualizer, type PivotStrategy } from './algorithms/quickSort'
import { ClosestPairVisualizer } from './algorithms/closestPair'
import { SelectLinearVisualizer } from './algorithms/selectLinear'
import type { AlgorithmType, Point, SortingStep, ClosestPairStep, SelectLinearStep } from './types'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('mergeSort')
  const [inputArray, setInputArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90])
  const [inputPoints, setInputPoints] = useState<Point[]>([
    { x: 2, y: 3, id: 1 },
    { x: 12, y: 30, id: 2 },
    { x: 40, y: 50, id: 3 },
    { x: 5, y: 1, id: 4 },
    { x: 12, y: 10, id: 5 },
    { x: 3, y: 4, id: 6 }
  ])
  const [kValue, setKValue] = useState(3)
  const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>('random')

  const visualization = useAlgorithmVisualization()

  const algorithms = [
    { value: 'mergeSort', name: 'Merge Sort', complexity: 'O(n log n)' },
    { value: 'quickSort', name: 'Quick Sort', complexity: 'O(n log n) médio' },
    { value: 'closestPair', name: 'Closest Pair', complexity: 'O(n log n)' },
    { value: 'selectLinear', name: 'Select Linear', complexity: 'O(n)' }
  ] as const

  const runAlgorithm = () => {
    let steps: any[] = []

    switch (selectedAlgorithm) {
      case 'mergeSort':
        const mergeSorter = new MergeSortVisualizer()
        steps = mergeSorter.sort(inputArray)
        break
      case 'quickSort':
        const quickSorter = new QuickSortVisualizer(pivotStrategy)
        steps = quickSorter.sort(inputArray)
        break
      case 'closestPair':
        const closestPairFinder = new ClosestPairVisualizer()
        steps = closestPairFinder.findClosestPair(inputPoints)
        break
      case 'selectLinear':
        const selector = new SelectLinearVisualizer()
        steps = selector.select(inputArray, kValue)
        break
    }

    visualization.setSteps(steps)
  }

  const generateRandomArray = () => {
    const size = 8
    const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
    setInputArray(array)
  }

  const generateRandomPoints = () => {
    const count = 8
    const points: Point[] = Array.from({ length: count }, (_, i) => ({
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 60) + 10,
      id: i + 1
    }))
    setInputPoints(points)
  }

  const renderVisualization = () => {
    if (!visualization.currentStepData) return null

    switch (selectedAlgorithm) {
      case 'mergeSort':
      case 'quickSort':
      case 'selectLinear':
        return (
          <ArrayVisualizer step={visualization.currentStepData as SortingStep | SelectLinearStep} />
        )
      case 'closestPair':
        return <PointsVisualizer step={visualization.currentStepData as ClosestPairStep} />
      default:
        return null
    }
  }

  const renderInputSection = () => {
    switch (selectedAlgorithm) {
      case 'mergeSort':
      case 'quickSort':
        return (
          <div className='space-y-4'>
            <div>
              <label className='label'>
                <span className='label-text'>Array de entrada</span>
              </label>
              <input
                type='text'
                value={inputArray.join(', ')}
                onChange={e => {
                  const values = e.target.value
                    .split(',')
                    .map(v => parseInt(v.trim()))
                    .filter(v => !isNaN(v))
                  setInputArray(values)
                }}
                className='input input-bordered w-full'
                placeholder='Digite números separados por vírgula'
              />
            </div>
            {selectedAlgorithm === 'quickSort' && (
              <div>
                <label className='label'>
                  <span className='label-text'>Estratégia do pivô</span>
                </label>
                <select
                  value={pivotStrategy}
                  onChange={e => setPivotStrategy(e.target.value as PivotStrategy)}
                  className='select select-bordered w-full'
                >
                  <option value='random'>Pivô aleatório</option>
                  <option value='median-of-three'>Mediana de três</option>
                </select>
              </div>
            )}
            <button onClick={generateRandomArray} className='btn btn-outline btn-sm'>
              Gerar Array Aleatório
            </button>
          </div>
        )
      case 'closestPair':
        return (
          <div className='space-y-4'>
            <div>
              <label className='label'>
                <span className='label-text'>Pontos (formato: x,y por linha)</span>
              </label>
              <textarea
                value={inputPoints.map(p => `${p.x},${p.y}`).join('\n')}
                onChange={e => {
                  const lines = e.target.value.split('\n')
                  const points: Point[] = lines
                    .map((line, i) => {
                      const [x, y] = line.split(',').map(v => parseFloat(v.trim()))
                      return !isNaN(x) && !isNaN(y) ? { x, y, id: i + 1 } : null
                    })
                    .filter(p => p !== null) as Point[]
                  setInputPoints(points)
                }}
                className='textarea textarea-bordered w-full h-32'
                placeholder='2,3&#10;12,30&#10;40,50'
              />
            </div>
            <button onClick={generateRandomPoints} className='btn btn-outline btn-sm'>
              Gerar Pontos Aleatórios
            </button>
          </div>
        )
      case 'selectLinear':
        return (
          <div className='space-y-4'>
            <div>
              <label className='label'>
                <span className='label-text'>Array de entrada</span>
              </label>
              <input
                type='text'
                value={inputArray.join(', ')}
                onChange={e => {
                  const values = e.target.value
                    .split(',')
                    .map(v => parseInt(v.trim()))
                    .filter(v => !isNaN(v))
                  setInputArray(values)
                }}
                className='input input-bordered w-full'
                placeholder='Digite números separados por vírgula'
              />
            </div>
            <div>
              <label className='label'>
                <span className='label-text'>k-ésimo menor elemento (k)</span>
              </label>
              <input
                type='number'
                value={kValue}
                onChange={e => setKValue(parseInt(e.target.value) || 1)}
                min='1'
                max={inputArray.length}
                className='input input-bordered w-full'
              />
            </div>
            <button onClick={generateRandomArray} className='btn btn-outline btn-sm'>
              Gerar Array Aleatório
            </button>
          </div>
        )
    }
  }

  return (
    <div className='min-h-screen bg-base-100'>
      {/* Header */}
      <div className='navbar bg-base-300'>
        <div className='navbar-start'>
          <h1 className='text-xl font-bold'>Visualizador de Algoritmos D&C</h1>
        </div>
        <div className='navbar-end'>
          <button
            onClick={toggleTheme}
            className='btn btn-ghost btn-circle'
            aria-label='Toggle theme'
          >
            {theme === 'light' ? (
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
              </svg>
            ) : (
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className='container mx-auto p-6 space-y-6'>
        {/* Configuração */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='card bg-base-200 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title'>Configuração</h2>

              <div className='space-y-4'>
                <div>
                  <label className='label'>
                    <span className='label-text'>Algoritmo</span>
                  </label>
                  <select
                    value={selectedAlgorithm}
                    onChange={e => setSelectedAlgorithm(e.target.value as AlgorithmType)}
                    className='select select-bordered w-full'
                  >
                    {algorithms.map(alg => (
                      <option key={alg.value} value={alg.value}>
                        {alg.name} - {alg.complexity}
                      </option>
                    ))}
                  </select>
                </div>

                {renderInputSection()}

                <button onClick={runAlgorithm} className='btn btn-primary w-full'>
                  Executar Algoritmo
                </button>
              </div>
            </div>
          </div>

          {/* Informações do algoritmo */}
          <div className='card bg-base-200 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title'>Sobre o Algoritmo</h2>
              <div className='space-y-2 text-sm'>
                {selectedAlgorithm === 'mergeSort' && (
                  <div>
                    <p>
                      <strong>Merge Sort:</strong> Algoritmo estável de ordenação que divide o array
                      em duas metades, ordena cada metade recursivamente e depois combina os
                      resultados.
                    </p>
                    <p>
                      <strong>Complexidade:</strong> O(n log n) em todos os casos
                    </p>
                    <p>
                      <strong>Estratégia:</strong> Dividir e conquistar
                    </p>
                  </div>
                )}
                {selectedAlgorithm === 'quickSort' && (
                  <div>
                    <p>
                      <strong>Quick Sort:</strong> Algoritmo de ordenação que escolhe um pivô,
                      particiona o array e ordena as partições recursivamente.
                    </p>
                    <p>
                      <strong>Complexidade:</strong> O(n log n) médio, O(n²) pior caso
                    </p>
                    <p>
                      <strong>Estratégia:</strong> Dividir e conquistar com particionamento
                    </p>
                  </div>
                )}
                {selectedAlgorithm === 'closestPair' && (
                  <div>
                    <p>
                      <strong>Closest Pair:</strong> Encontra o par de pontos mais próximos em um
                      conjunto de pontos 2D.
                    </p>
                    <p>
                      <strong>Complexidade:</strong> O(n log n)
                    </p>
                    <p>
                      <strong>Estratégia:</strong> Divide por linha vertical e combina resultados
                    </p>
                  </div>
                )}
                {selectedAlgorithm === 'selectLinear' && (
                  <div>
                    <p>
                      <strong>Select Linear:</strong> Encontra o k-ésimo menor elemento em tempo
                      linear garantido.
                    </p>
                    <p>
                      <strong>Complexidade:</strong> O(n)
                    </p>
                    <p>
                      <strong>Estratégia:</strong> Mediana das medianas como pivô
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visualização */}
        {visualization.state.steps.length > 0 && (
          <div className='space-y-6'>
            <div className='card bg-base-200 shadow-xl'>
              <div className='card-body'>
                <h2 className='card-title'>Visualização</h2>
                {renderVisualization()}
              </div>
            </div>

            {/* Descrição do passo atual */}
            {visualization.currentStepData && (
              <div className='alert'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='stroke-info shrink-0 w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  ></path>
                </svg>
                <div>
                  <h3 className='font-bold'>Passo {visualization.state.currentStep + 1}</h3>
                  <div className='text-xs'>{visualization.currentStepData.description}</div>
                </div>
              </div>
            )}

            {/* Controles */}
            <VisualizationControls
              currentStep={visualization.state.currentStep}
              totalSteps={visualization.state.steps.length}
              isPlaying={visualization.state.isPlaying}
              speed={visualization.state.speed}
              canGoNext={visualization.canGoNext}
              canGoPrevious={visualization.canGoPrevious}
              onNext={visualization.nextStep}
              onPrevious={visualization.previousStep}
              onPlay={visualization.play}
              onPause={visualization.pause}
              onReset={visualization.reset}
              onSpeedChange={visualization.setSpeed}
              onGoToStep={visualization.goToStep}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
