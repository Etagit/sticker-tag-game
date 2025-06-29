class GroundRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
    }
    
    render() {
        const groundY = 0;
        const gridSize = 50;
        const gridSpacing = 2;
        
        // Create ground plane with perspective and GREEN color
        const corners = [
            this.camera.worldToScreen(new Vector3(-gridSize, groundY, -gridSize)),
            this.camera.worldToScreen(new Vector3(gridSize, groundY, -gridSize)),
            this.camera.worldToScreen(new Vector3(gridSize, groundY, gridSize)),
            this.camera.worldToScreen(new Vector3(-gridSize, groundY, gridSize))
        ].filter(p => p !== null);
        
        if (corners.length >= 3) {
            this.ctx.fillStyle = '#32CD32'; // Lime green
            this.ctx.beginPath();
            this.ctx.moveTo(corners[0].x, corners[0].y);
            corners.slice(1).forEach(corner => this.ctx.lineTo(corner.x, corner.y));
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.drawGridLines(groundY, gridSize, gridSpacing);
    }
    
    drawGridLines(groundY, gridSize, gridSpacing) {
        this.ctx.strokeStyle = 'rgba(50, 205, 50, 0.3)';
        this.ctx.lineWidth = 1;
        
        // Draw grid lines every 4 units for less density
        for (let x = -gridSize; x <= gridSize; x += gridSpacing * 4) {
            const start = this.camera.worldToScreen(new Vector3(x, groundY + 0.01, -gridSize));
            const end = this.camera.worldToScreen(new Vector3(x, groundY + 0.01, gridSize));
            
            if (start && end) {
                this.ctx.beginPath();
                this.ctx.moveTo(start.x, start.y);
                this.ctx.lineTo(end.x, end.y);
                this.ctx.stroke();
            }
        }
        
        for (let z = -gridSize; z <= gridSize; z += gridSpacing * 4) {
            const start = this.camera.worldToScreen(new Vector3(-gridSize, groundY + 0.01, z));
            const end = this.camera.worldToScreen(new Vector3(gridSize, groundY + 0.01, z));
            
            if (start && end) {
                this.ctx.beginPath();
                this.ctx.moveTo(start.x, start.y);
                this.ctx.lineTo(end.x, end.y);
                this.ctx.stroke();
            }
        }
    }
}