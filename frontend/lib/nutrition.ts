
import foodsData from "../data/foods.json";

export type NutrientKey =
  | "energy_kcal"
  | "protein_g"
  | "iron_mg"
  | "calcium_mg"
  | "fibre_g";

export type MealIngredient = {
  foodId: string;
  grams: number;
};

type FoodRecord = {
  id: string;
  name: string;
  nutrients: Record<NutrientKey, number | null>;
  verified: boolean;
};

const foods = foodsData as FoodRecord[];

const nutrientKeys: NutrientKey[] = [
  "energy_kcal",
  "protein_g",
  "iron_mg",
  "calcium_mg",
  "fibre_g",
];

export function calculateMealNutrition(ingredients: MealIngredient[]) {
  const totals: Record<NutrientKey, number | null> = {
    energy_kcal: 0,
    protein_g: 0,
    iron_mg: 0,
    calcium_mg: 0,
    fibre_g: 0,
  };

  const unavailableFoods: string[] = [];
  let allNutrientsAvailable = true;
  for (const ingredient of ingredients) {
    const food = foods.find((item) => item.id === ingredient.foodId);

    if (
      !food ||
      !food.verified ||
      !Number.isFinite(ingredient.grams) ||
      ingredient.grams <= 0
    ) {
      unavailableFoods.push(ingredient.foodId);

      for (const key of nutrientKeys) {
        totals[key] = null;
      }

      continue;
    }

    for (const key of nutrientKeys) {
      const value = food.nutrients[key];

      if (value === null || !Number.isFinite(value)) {
        totals[key] = null;
        allNutrientsAvailable = false;
        continue;
      }

      if (totals[key] !== null) {
        totals[key] =
          totals[key]! + (value * ingredient.grams) / 100;
      }
    }
  }

  for (const key of nutrientKeys) {
    if (totals[key] !== null) {
      totals[key] = Math.round(totals[key]! * 100) / 100;
    }
  }

  return {
    totals,
    unavailableFoods,
    canCalculate:
        ingredients.length > 0 &&
        unavailableFoods.length === 0 &&
        allNutrientsAvailable,
  };
}
