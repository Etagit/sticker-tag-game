class InputHandler {
    constructor() {
        this.keys = {};
        this.mouseMovement = { x: 0, y: 0 };
        this.onMouseMove = null;
        this.onKeyDown = null;
        this.onKeyUp = null;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (this.onKeyDown) this.onKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            if (this.onKeyUp) this.onKeyUp(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.onMouseMove) this.onMouseMove(e);
        });
    }
    
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
}