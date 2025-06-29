class TextureGenerator {
    static createGrassTexture(ctx) {
        const grassCanvas = document.createElement('canvas');
        grassCanvas.width = 32;
        grassCanvas.height = 32;
        const grassCtx = grassCanvas.getContext('2d');
        
        // Base grass color
        grassCtx.fillStyle = '#228B22';
        grassCtx.fillRect(0, 0, 32, 32);
        
        // Add grass texture with random darker spots
        for (let i = 0; i < 100; i++) {
            grassCtx.fillStyle = `rgba(34, 100, 34, ${0.3 + Math.random() * 0.4})`;
            grassCtx.fillRect(Math.random() * 32, Math.random() * 32, 1, 1);
        }
        
        return ctx.createPattern(grassCanvas, 'repeat');
    }
    
    static createConcreteTexture(ctx) {
        const concreteCanvas = document.createElement('canvas');
        concreteCanvas.width = 64;
        concreteCanvas.height = 64;
        const concreteCtx = concreteCanvas.getContext('2d');
        
        // Base concrete color
        concreteCtx.fillStyle = '#A9A9A9';
        concreteCtx.fillRect(0, 0, 64, 64);
        
        // Add concrete texture with noise
        for (let i = 0; i < 200; i++) {
            const brightness = 0.8 + Math.random() * 0.4;
            concreteCtx.fillStyle = `rgba(169, 169, 169, ${brightness})`;
            concreteCtx.fillRect(Math.random() * 64, Math.random() * 64, 2, 2);
        }
        
        // Add some cracks
        concreteCtx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
        concreteCtx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            concreteCtx.beginPath();
            concreteCtx.moveTo(Math.random() * 64, Math.random() * 64);
            concreteCtx.lineTo(Math.random() * 64, Math.random() * 64);
            concreteCtx.stroke();
        }
        
        return ctx.createPattern(concreteCanvas, 'repeat');
    }
}