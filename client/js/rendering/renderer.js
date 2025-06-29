class Renderer3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = new Camera3D(canvas);
        this.depthBuffer = [];
        
        // Initialize sub-renderers
        this.skyRenderer = new SkyRenderer(canvas, this.ctx);
        this.groundRenderer = new GroundRenderer(this.ctx, this.camera);
        this.buildingRenderer = new BuildingRenderer(this.ctx, this.camera);
        this.playerRenderer = new PlayerRenderer(this.ctx, this.camera);
        
        // Create textures
        this.grassPattern = TextureGenerator.createGrassTexture(this.ctx);
        this.concretePattern = TextureGenerator.createConcreteTexture(this.ctx);
    }
    
    clear() {
        this.skyRenderer.render();
        this.depthBuffer = [];
    }
    
    drawGround() {
        this.groundRenderer.render();
    }
    
    drawCube(position, size, height, isBuilding = true) {
        this.buildingRenderer.render(position, size, height, this.depthBuffer);
    }
    
    drawPlayer(position, sticker) {
        this.playerRenderer.render(position, sticker, this.depthBuffer);
    }
    
    render() {
        // Sort by depth (back to front)
        this.depthBuffer.sort((a, b) => b.depth - a.depth);
        
        // Draw all objects
        this.depthBuffer.forEach(item => item.draw());
    }
}