class Game3D {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer3D(this.canvas);
        this.input = new InputHandler();
        this.powerupSystem = new PowerupSystem();
        this.network = new NetworkManager();
        
        this.setupCanvas();
        this.setupGame();
        this.setupControls();
        
        this.lastTime = 0;
        this.init();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resizeCanvas(), 100);
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        this.renderer.camera.updateProjectionMatrix();
    }
    
    setupGame() {
        this.players = new Map();
        this.buildings = [];
        
        // Create local player
        this.localPlayer = new Player3D('local', 0, 2, 0, '😀');
        this.players.set('local', this.localPlayer);
        
        // Generate realistic buildings
        this.generateBuildings();
    }
    
    generateBuildings() {
        const buildingCount = 12;
        const mapSize = 35;
        
        for (let i = 0; i < buildingCount; i++) {
            const x = (Math.random() - 0.5) * mapSize;
            const z = (Math.random() - 0.5) * mapSize;
            const height = 3 + Math.random() * 8;
            const size = 3 + Math.random() * 4;
            
            this.buildings.push({
                position: new Vector3(x, height / 2, z),
                size: size,
                height: height,
                type: 'building'
            });
        }
    }
    
    setupControls() {
        this.input.onMouseMove = (event) => this.onMouseMove(event);
        this.input.onKeyDown = (event) => this.onKeyDown(event);
        
        document.addEventListener('click', () => this.requestPointerLock());
    }
    
    requestPointerLock() {
        this.canvas.requestPointerLock();
    }
    
    onMouseMove(event) {
        if (document.pointerLockElement === this.canvas) {
            const sensitivity = 0.002;
            this.renderer.camera.rotation.y -= event.movementX * sensitivity;
            this.renderer.camera.rotation.x -= event.movementY * sensitivity;
            this.renderer.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.renderer.camera.rotation.x));
        }
    }
    
    onKeyDown(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            this.handleCatchAttempt();
        }
    }
    
    updatePlayer(deltaTime) {
        if (!this.localPlayer || this.localPlayer.frozen) return;
        
        const moveSpeed = 8;
        const camera = this.renderer.camera;
        
        let moveX = 0;
        let moveZ = 0;
        
        if (this.input.isKeyPressed('KeyW')) moveZ += 1; // Forward
        if (this.input.isKeyPressed('KeyS')) moveZ -= 1; // Backward
        if (this.input.isKeyPressed('KeyA')) moveX -= 1; // Left
        if (this.input.isKeyPressed('KeyD')) moveX += 1; // Right
        
        if (moveX !== 0 || moveZ !== 0) {
            // Normalize diagonal movement
            const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX /= length;
            moveZ /= length;
            
            // Apply camera rotation to movement
            const cos = Math.cos(camera.rotation.y);
            const sin = Math.sin(camera.rotation.y);
            
            const worldMoveX = moveX * cos - moveZ * sin;
            const worldMoveZ = moveX * sin + moveZ * cos;
            
            camera.position.x += worldMoveX * moveSpeed * deltaTime;
            camera.position.z += worldMoveZ * moveSpeed * deltaTime;
            
            // Update player position to match camera
            this.localPlayer.position.x = camera.position.x;
            this.localPlayer.position.z = camera.position.z;
        }
    }
    
    handleCatchAttempt() {
        const prompt = document.getElementById('catch-prompt');
        if (prompt) {
            prompt.style.display = 'block';
            setTimeout(() => prompt.style.display = 'none', 1000);
        }
    }
    
    update(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.updatePlayer(deltaTime);
        
        // Update all players
        for (let [id, player] of this.players) {
            player.update(deltaTime);
        }
        
        this.powerupSystem.update(deltaTime);
    }
    
    render() {
        this.renderer.clear();
        this.renderer.drawGround();
        
        // Draw buildings
        this.buildings.forEach(building => {
            this.renderer.drawCube(building.position, building.size, building.height, true);
        });
        
        // Draw other players
        for (let [id, player] of this.players) {
            if (id !== 'local') {
                this.renderer.drawPlayer(player.position, player.sticker);
            }
        }
        
        this.renderer.render();
    }
    
    init() {
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'none';
        }, 1000);
        
        this.gameLoop();
    }
    
    gameLoop = (currentTime) => {
        this.update(currentTime);
        this.render();
        requestAnimationFrame(this.gameLoop);
    }
}

// Start the game
window.addEventListener('load', () => {
    window.game = new Game3D();
});