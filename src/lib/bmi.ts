export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

export const getBMICategory = (bmi: number): { label: string; color: string; message: string } => {
  if (bmi < 18.5) return { label: "Underweight", color: "text-info", message: "You may need to gain some weight. Consider a balanced diet." };
  if (bmi < 25) return { label: "Normal", color: "text-success", message: "Great! You're in a healthy range. Keep it up!" };
  if (bmi < 30) return { label: "Overweight", color: "text-warning", message: "Slightly above normal. Regular exercise and balanced meals help." };
  return { label: "Obese", color: "text-destructive", message: "Consider consulting a healthcare professional for guidance." };
};
