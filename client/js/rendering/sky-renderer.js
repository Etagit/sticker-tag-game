class SkyRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Fixed cloud positions that don't move with camera
        this.cloudPositions = [
            { x: 0.2, y: 0.2, size: 40 },
            { x: 0.7, y: 0.15, size: 35 },
            { x: 0.5, y: 0.25, size: 25 },
            { x: 0.9, y: 0.3, size: 30 },
            { x: 0.1, y: 0.35, size: 25 },
        ];
    }
    
    render() {
        this.drawSky();
        this.drawClouds();
    }
    
    drawSky() {
        // Realistic sky gradient - blue to lighter blue
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue at horizon
        gradient.addColorStop(0.7, '#4682B4'); // Steel blue higher up
        gradient.addColorStop(1, '#1E90FF'); // Dodger blue at top
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        this.cloudPositions.forEach(cloud => {
            const x = this.canvas.width * cloud.x;
            const y = this.canvas.height * cloud.y;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, cloud.size, 0, Math.PI * 2);
            this.ctx.arc(x + 25, y, cloud.size * 0.8, 0, Math.PI * 2);
            this.ctx.arc(x - 25, y, cloud.size * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}