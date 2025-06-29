class PlayerRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
    }
    
    render(position, sticker, depthBuffer) {
        const screenPos = this.camera.worldToScreen(position);
        if (!screenPos) return;
        
        const size = Math.max(20, 60 / screenPos.z);
        
        depthBuffer.push({
            depth: screenPos.z,
            draw: () => this.drawPlayer(screenPos, sticker, size)
        });
    }
    
    drawPlayer(screenPos, sticker, size) {
        // Shadow on ground
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(screenPos.x, screenPos.y + size/2, size/3, size/6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player sticker
        this.ctx.font = `${size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Outline for better visibility
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = Math.max(1, size/20);
        this.ctx.strokeText(sticker, screenPos.x, screenPos.y);
        
        // Main sticker
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(sticker, screenPos.x, screenPos.y);
    }
}