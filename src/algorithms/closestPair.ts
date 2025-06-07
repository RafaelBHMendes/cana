import type { Point, ClosestPairStep } from '../types';

export class ClosestPairVisualizer {
    private steps: ClosestPairStep[] = [];
    private stepId = 0;

    public findClosestPair(points: Point[]): ClosestPairStep[] {
        this.steps = [];
        this.stepId = 0;

        if (points.length < 2) {
            this.addStep({
                points: [...points],
                description: 'Necessário pelo menos 2 pontos',
                type: 'divide'
            });
            return this.steps;
        }

        // Passo inicial
        this.addStep({
            points: [...points],
            description: `Iniciando busca pelo par mais próximo entre ${points.length} pontos`,
            type: 'divide'
        });

        // Ordenar pontos por coordenada x
        const sortedPoints = [...points].sort((a, b) => a.x - b.x);

        this.addStep({
            points: sortedPoints,
            description: 'Pontos ordenados por coordenada x',
            type: 'divide'
        });

        const result = this.closestPairRec(sortedPoints);

        this.addStep({
            points: sortedPoints,
            currentPair: result.pair,
            minDistance: result.distance,
            description: `Par mais próximo encontrado: distância ${result.distance.toFixed(2)}`,
            type: 'combine'
        });

        return this.steps;
    }

    private closestPairRec(points: Point[]): { pair: [Point, Point], distance: number } {
        const n = points.length;

        // Caso base: força bruta para arrays pequenos
        if (n <= 3) {
            return this.bruteForce(points);
        }

        const mid = Math.floor(n / 2);
        const midPoint = points[mid];
        const divisionLine = midPoint.x;

        this.addStep({
            points: [...points],
            divisionLine,
            description: `Dividindo em x = ${divisionLine}`,
            type: 'divide'
        });

        const leftPoints = points.slice(0, mid);
        const rightPoints = points.slice(mid);

        this.addStep({
            points: [...points],
            leftPoints: [...leftPoints],
            rightPoints: [...rightPoints],
            divisionLine,
            description: `Lado esquerdo: ${leftPoints.length} pontos, Lado direito: ${rightPoints.length} pontos`,
            type: 'divide'
        });

        // Recursão
        const leftResult = this.closestPairRec(leftPoints);
        const rightResult = this.closestPairRec(rightPoints);

        // Determinar o menor resultado das duas metades
        const minResult = leftResult.distance <= rightResult.distance ? leftResult : rightResult;

        this.addStep({
            points: [...points],
            leftPoints: [...leftPoints],
            rightPoints: [...rightPoints],
            divisionLine,
            currentPair: minResult.pair,
            minDistance: minResult.distance,
            description: `Menor distância entre as metades: ${minResult.distance.toFixed(2)}`,
            type: 'conquer'
        });

        // Verificar pontos na faixa central
        const stripResult = this.checkStrip(points, divisionLine, minResult.distance);

        return stripResult.distance < minResult.distance ? stripResult : minResult;
    }

    private bruteForce(points: Point[]): { pair: [Point, Point], distance: number } {
        let minDistance = Infinity;
        let closestPair: [Point, Point] = [points[0], points[1]];

        this.addStep({
            points: [...points],
            description: `Força bruta para ${points.length} pontos`,
            type: 'conquer'
        });

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const distance = this.calculateDistance(points[i], points[j]);

                this.addStep({
                    points: [...points],
                    currentPair: [points[i], points[j]],
                    minDistance: Math.min(minDistance, distance),
                    description: `Comparando pontos ${points[i].id} e ${points[j].id}: distância ${distance.toFixed(2)}`,
                    type: 'conquer',
                    comparisons: [i, j]
                });

                if (distance < minDistance) {
                    minDistance = distance;
                    closestPair = [points[i], points[j]];
                }
            }
        }

        return { pair: closestPair, distance: minDistance };
    }

    private checkStrip(points: Point[], divisionLine: number, currentMin: number): { pair: [Point, Point], distance: number } {
        // Pontos candidatos na faixa central
        const candidatePoints = points.filter(p => Math.abs(p.x - divisionLine) < currentMin);

        this.addStep({
            points: [...points],
            candidatePoints: [...candidatePoints],
            divisionLine,
            minDistance: currentMin,
            description: `Verificando ${candidatePoints.length} pontos candidatos na faixa central`,
            type: 'combine'
        });

        if (candidatePoints.length < 2) {
            return { pair: [points[0], points[1]], distance: currentMin };
        }

        // Ordenar por coordenada y
        candidatePoints.sort((a, b) => a.y - b.y);

        let minDistance = currentMin;
        let closestPair: [Point, Point] = [points[0], points[1]];

        for (let i = 0; i < candidatePoints.length; i++) {
            for (let j = i + 1; j < candidatePoints.length && (candidatePoints[j].y - candidatePoints[i].y) < minDistance; j++) {
                const distance = this.calculateDistance(candidatePoints[i], candidatePoints[j]);

                this.addStep({
                    points: [...points],
                    candidatePoints: [...candidatePoints],
                    currentPair: [candidatePoints[i], candidatePoints[j]],
                    minDistance: Math.min(minDistance, distance),
                    divisionLine,
                    description: `Verificando par na faixa: pontos ${candidatePoints[i].id} e ${candidatePoints[j].id}, distância ${distance.toFixed(2)}`,
                    type: 'combine'
                });

                if (distance < minDistance) {
                    minDistance = distance;
                    closestPair = [candidatePoints[i], candidatePoints[j]];
                }
            }
        }

        return { pair: closestPair, distance: minDistance };
    }

    private calculateDistance(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    private addStep(stepData: Omit<ClosestPairStep, 'id' | 'data'>): void {
        this.steps.push({
            id: this.stepId++,
            data: stepData,
            ...stepData
        });
    }
} 