class MathUtils {
    static adjustBrightness(color, percent) {
        // Convert hex to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Adjust brightness
        const newR = Math.max(0, Math.min(255, r + percent));
        const newG = Math.max(0, Math.min(255, g + percent));
        const newB = Math.max(0, Math.min(255, b + percent));
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
}