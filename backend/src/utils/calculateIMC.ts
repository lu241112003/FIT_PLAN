// src/utils/calculateIMC.ts

export function calculateIMC(peso_kg: number, altura_cm: number): number {
  if (altura_cm <= 0 || peso_kg <= 0) {
    throw new Error('Peso e altura devem ser maiores que zero')
  }

  const altura_m = altura_cm / 100
  return peso_kg / (altura_m * altura_m)
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

export function getTMB(
  peso_kg: number,
  altura_cm: number,
  idade_anos: number,
  sexo: 'masculino' | 'feminino'
): number {
  // Fórmula de Harris-Benedict
  if (sexo === 'masculino') {
    return (
      88.362 +
      13.397 * peso_kg +
      4.799 * altura_cm -
      5.677 * idade_anos
    )
  } else {
    return (
      447.593 +
      9.247 * peso_kg +
      3.098 * altura_cm -
      4.33 * idade_anos
    )
  }
}

export function getTDEE(tmb: number, activityLevel: number): number {
  // Activity levels: sedentário (1.2), pouco ativo (1.375), moderado (1.55), muito ativo (1.725), extremamente ativo (1.9)
  return tmb * activityLevel
}
