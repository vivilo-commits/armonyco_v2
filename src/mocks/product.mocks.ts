import { ProductModule } from '../models/product.model';
import { productModules as baseModules } from '../../data/modules';

// Cast the imported base modules to the new ProductModule interface (assuming structure compatibility or enhancing it)
// We need to apply the marketplace state overrides here to match the "Demo" state.

export const mockProductModules: ProductModule[] = baseModules.map((m: any, i: number) => {
    let isPurchased = true;
    let isPaused = i % 4 === 1; // Some paused
    let isActive = !isPaused;

    // Force at least one inactive per category for demonstration
    const categoryModules = baseModules.filter((mod: any) => mod.category === m.category);
    const firstOfCategory = categoryModules[0];

    if (m.id === firstOfCategory.id) {
        isPurchased = false;
        isPaused = false;
        isActive = false;
    }

    return {
        ...m,
        creditCost: 25000,
        isPurchased,
        isActive,
        isPaused,
        laborReduction: `${70 + (i % 25)}%`,
        valueGenerated: `${(1 + (i % 5)) * 400}€/mo`
    };
});
