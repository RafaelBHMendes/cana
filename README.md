# 🎯 Visualizador de Algoritmos de Divisão e Conquista

Um aplicativo web interativo para visualizar, passo a passo, o funcionamento de algoritmos clássicos de divisão e conquista. Desenvolvido com React, TypeScript, Tailwind CSS e DaisyUI.

## 📋 Sobre o Projeto

Este projeto é uma ferramenta educacional que permite aos usuários compreender visualmente como funcionam os algoritmos de divisão e conquista, mostrando cada etapa do processo de forma gráfica e interativa.

### 🧩 Algoritmos Implementados

#### 1. **Merge Sort**

- **Complexidade:** O(n log n) em todos os casos
- **Estratégia:** Divide o array em duas metades, ordena recursivamente e combina os resultados
- **Visualização:** Barras coloridas mostrando divisões, comparações e fusões

#### 2. **Quick Sort**

- **Complexidade:** O(n log n) médio, O(n²) pior caso
- **Estratégias de pivô:**
  - Pivô aleatório
  - Median-of-three (mediana entre primeiro, meio e último)
- **Visualização:** Destaque do pivô, particionamento e recursão

#### 3. **Closest Pair**

- **Complexidade:** O(n log n)
- **Problema:** Encontrar o par de pontos mais próximos em um conjunto 2D
- **Visualização:** Gráfico de pontos com linha de divisão, candidatos e conexões

#### 4. **Select Linear**

- **Complexidade:** O(n) garantido
- **Problema:** Encontrar o k-ésimo menor elemento
- **Estratégia:** Algoritmo da mediana das medianas
- **Visualização:** Grupos de 5, medianas e particionamento

## ✨ Funcionalidades

### 🎮 Controles de Navegação

- **Reproduzir/Pausar:** Execução automática da visualização
- **Próximo/Anterior:** Navegação manual entre passos
- **Reiniciar:** Volta ao estado inicial
- **Slider de progresso:** Navega diretamente para qualquer passo
- **Controle de velocidade:** 6 níveis (0.5x a 4x)

### 🎨 Interface e Visualização

- **Tema claro/escuro:** Alternância automática com DaisyUI
- **Visualizações adaptadas:**
  - Arrays: Barras proporcionais com cores semânticas
  - Pontos 2D: Gráfico de dispersão interativo
- **Legendas e destaques:** Cores específicas para cada tipo de operação
- **Descrições contextuais:** Explicação de cada passo

### ⚙️ Configuração Flexível

- **Entrada manual:** Digite seus próprios dados
- **Geração aleatória:** Crie conjuntos de dados automaticamente
- **Parâmetros específicos:**
  - Estratégia de pivô para Quick Sort
  - Valor k para Select Linear
  - Coordenadas personalizadas para Closest Pair

## 🚀 Como Usar

### 1. **Selecione um Algoritmo**

Escolha entre Merge Sort, Quick Sort, Closest Pair ou Select Linear no dropdown.

### 2. **Configure os Dados**

- **Arrays:** Digite números separados por vírgula ou gere aleatoriamente
- **Pontos:** Insira coordenadas x,y ou gere pontos aleatórios
- **Select Linear:** Defina o valor k (k-ésimo menor elemento)

### 3. **Execute e Visualize**

Clique em "Executar Algoritmo" e use os controles para navegar pela visualização.

### 4. **Aprenda**

Acompanhe as descrições de cada passo e observe como o algoritmo divide, conquista e combina.

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca para interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Framework CSS utilitário
- **DaisyUI 5** - Componentes pré-construídos
- **ESLint** - Linting de código

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd cana
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute em modo de desenvolvimento**

```bash
npm run dev
```

4. **Acesse no navegador**

```
http://localhost:5173
```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificação de código

## 📁 Estrutura do Projeto

```
src/
├── algorithms/           # Implementação dos algoritmos
│   ├── mergeSort.ts     # Merge Sort com visualização
│   ├── quickSort.ts     # Quick Sort com duas estratégias
│   ├── closestPair.ts   # Closest Pair 2D
│   └── selectLinear.ts  # Select Linear (mediana das medianas)
├── components/          # Componentes React
│   ├── ArrayVisualizer.tsx        # Visualização de arrays
│   ├── PointsVisualizer.tsx       # Visualização de pontos 2D
│   └── VisualizationControls.tsx  # Controles de navegação
├── hooks/               # React hooks customizados
│   ├── useTheme.ts                # Gerenciamento de tema
│   └── useAlgorithmVisualization.ts # Controle da visualização
├── types/               # Definições TypeScript
│   └── index.ts         # Interfaces e tipos
└── App.tsx             # Componente principal
```

## 🎯 Conceitos Educacionais

### Divisão e Conquista

O projeto demonstra claramente as três fases dos algoritmos:

1. **Divisão:** Como o problema é quebrado em subproblemas menores
2. **Conquista:** Resolução dos subproblemas (recursivamente ou diretamente)
3. **Combinação:** Como os resultados são unidos para formar a solução final

### Complexidade Algorítmica

Cada algoritmo mostra na prática:

- Como a recursão afeta a complexidade
- Diferença entre melhor, médio e pior caso
- Impact of different pivot strategies

### Visualização Educativa

- **Cores semânticas:** Cada cor tem um significado específico
- **Animações suaves:** Transições que facilitam o acompanhamento
- **Descrições contextuais:** Explicações em português de cada operação

## 🎓 Objetivos de Aprendizado

- Compreender a estratégia de divisão e conquista
- Visualizar diferenças entre algoritmos de ordenação
- Entender complexidade algorítmica na prática
- Observar o impacto de diferentes heurísticas (pivôs)
- Aprender algoritmos geométricos (Closest Pair)
- Compreender algoritmos de seleção linear

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir melhorias
- Adicionar novos algoritmos
- Melhorar a documentação

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido como ferramenta educacional para o estudo de algoritmos de divisão e conquista.**
