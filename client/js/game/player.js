class Player3D {
    constructor(id, x, y, z, sticker) {
        this.id = id;
        this.position = new Vector3(x, y, z);
        this.rotation = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.sticker = sticker;
        this.role = 'runner'; // 'runner' or 'catcher'
        this.frozen = false;
        this.freezeTimer = 0;
    }
    
    update(deltaTime) {
        if (this.frozen) {
            this.freezeTimer -= deltaTime;
            if (this.freezeTimer <= 0) {
                this.frozen = false;
            }
        }
    }
    
    freeze(duration) {
        this.frozen = true;
        this.freezeTimer = duration;
    }
}