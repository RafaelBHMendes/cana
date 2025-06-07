import { useState, useEffect, useCallback } from 'react';
import type { AlgorithmStep, AlgorithmState } from '../types';

export const useAlgorithmVisualization = (initialSteps: AlgorithmStep[] = []) => {
    const [state, setState] = useState<AlgorithmState>({
        currentStep: 0,
        steps: initialSteps,
        isPlaying: false,
        speed: 1000, // milissegundos por passo
    });

    const [intervalId, setIntervalId] = useState<number | null>(null);

    // Limpa o interval quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    const nextStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1)
        }));
    }, []);

    const previousStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStep: Math.max(prev.currentStep - 1, 0)
        }));
    }, []);

    const goToStep = useCallback((stepIndex: number) => {
        setState(prev => ({
            ...prev,
            currentStep: Math.max(0, Math.min(stepIndex, prev.steps.length - 1))
        }));
    }, []);

    const reset = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStep: 0,
            isPlaying: false
        }));
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [intervalId]);

    const play = useCallback(() => {
        if (state.currentStep >= state.steps.length - 1) return;

        setState(prev => ({ ...prev, isPlaying: true }));

        const id = setInterval(() => {
            setState(prev => {
                if (prev.currentStep >= prev.steps.length - 1) {
                    clearInterval(id);
                    setIntervalId(null);
                    return { ...prev, isPlaying: false };
                }
                return { ...prev, currentStep: prev.currentStep + 1 };
            });
        }, state.speed);

        setIntervalId(id);
    }, [state.currentStep, state.steps.length, state.speed]);

    const pause = useCallback(() => {
        setState(prev => ({ ...prev, isPlaying: false }));
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [intervalId]);

    const setSpeed = useCallback((speed: number) => {
        setState(prev => ({ ...prev, speed }));
    }, []);

    const setSteps = useCallback((steps: AlgorithmStep[]) => {
        setState(prev => ({
            ...prev,
            steps,
            currentStep: 0,
            isPlaying: false
        }));
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [intervalId]);

    const currentStepData = state.steps[state.currentStep] || null;

    return {
        state,
        currentStepData,
        nextStep,
        previousStep,
        goToStep,
        reset,
        play,
        pause,
        setSpeed,
        setSteps,
        canGoNext: state.currentStep < state.steps.length - 1,
        canGoPrevious: state.currentStep > 0,
    };
}; 