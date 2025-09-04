import { describe, it, expect } from 'vitest';
import { validateId, validateCountryCode } from '../utils/index';

describe('basic utility functions tests', () => {
    it('should validate id', () => {
        expect(validateId('aardsda01')).toBe(true);
    });
    it('should validate country code', () => {
        expect(validateCountryCode('USA')).toBe(true);
    });
    // need some more tests here
});

