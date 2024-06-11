const { analyzeGlycemicImpact } = require('../services/dataAnalysis');

describe('Glycemic Impact Analysis', () => {
    it('should analyze glycemic index and load for meals', () => {
        const mockMeals = [
            {
                name: 'Oatmeal',
                carbs: 30,
                micronutrients: { fiber: 4 },
            },
            {
                name: 'Apple',
                carbs: 20,
                micronutrients: { fiber: 3 },
            },
        ];

        const result = analyzeGlycemicImpact(mockMeals);

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Oatmeal',
                    glycemicIndex: expect.any(Number),
                    glycemicLoad: expect.any(Number),
                }),
                expect.objectContaining({
                    name: 'Apple',
                    glycemicIndex: expect.any(Number),
                    glycemicLoad: expect.any(Number),
                }),
            ])
        );
    });
});