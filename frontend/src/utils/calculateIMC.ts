// src/utils/calculateIMC.ts

export function calculateIMC(peso_kg: number, altura_cm: number): number {
  if (altura_cm <= 0 || peso_kg <= 0) {
    throw new Error('Peso e altura devem ser maiores que zero')
  }
  const altura_m = altura_cm / 100
  return peso_kg / (altura_m * altura_m)
}



export const getIMCLabel = (imc: number): string => {
  if (imc < 18.5) return 'Abaixo do peso'
  if (imc < 25)   return 'Normal'
  if (imc < 30)   return 'Sobrepeso'
  return 'Obesidade'
}

export function getIMCCategory(imc: number): string {
  if (imc < 18.5) {
    return 'Abaixo do peso'
  } else if (imc < 25) {
    return 'Peso normal'
  } else if (imc < 30) {
    return 'Sobrepeso'
  } else if (imc < 35) {
    return 'Obesidade grau 1'
  } else if (imc < 40) {
    return 'Obesidade grau 2'
  } else {
    return 'Obesidade grau 3'
  }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('pt-BR')
}
