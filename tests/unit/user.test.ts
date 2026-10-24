import {describe, it, expect} from 'vitest';
import User from '../../src/models/User';


describe('isValidEmail',() => {
    
    it('should return true for valid email', () => {
        const user = User.create(1, "John Doe", "john.doe@example.com", "password123", 0, true, new Date(), new Date()
        );
        expect(user.isValidEmail("john.doe@example.com")).toBe(true);
    });
});