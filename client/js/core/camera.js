class Camera3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.position = new Vector3(0, 2, 0);
        this.rotation = new Vector3(0, 0, 0); // pitch, yaw, roll
        this.fov = 75 * Math.PI / 180; // Convert to radians
        this.near = 0.1;
        this.far = 100;
        
        this.updateProjectionMatrix();
    }
    
    updateProjectionMatrix() {
        const aspect = this.canvas.width / this.canvas.height;
        this.projectionMatrix = this.createProjectionMatrix(this.fov, aspect, this.near, this.far);
    }
    
    createProjectionMatrix(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        return {
            scale: f / aspect,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2
        };
    }
    
    worldToScreen(worldPos) {
        // Transform world position relative to camera
        const relative = worldPos.subtract(this.position);
        
        // Apply camera rotation
        const rotated = this.rotatePoint(relative, this.rotation);
        
        // Skip points behind camera
        if (rotated.z <= this.near) return null;
        
        // Project to screen space
        const scale = this.projectionMatrix.scale * (this.canvas.height / 2) / rotated.z;
        const screenX = this.projectionMatrix.centerX + rotated.x * scale;
        const screenY = this.projectionMatrix.centerY - rotated.y * scale;
        
        return {
            x: screenX,
            y: screenY,
            z: rotated.z // Keep depth for sorting
        };
    }
    
    rotatePoint(point, rotation) {
        let result = new Vector3(point.x, point.y, point.z);
        
        // Rotate around Y axis (yaw)
        if (rotation.y !== 0) {
            const cos = Math.cos(-rotation.y);
            const sin = Math.sin(-rotation.y);
            const newX = result.x * cos - result.z * sin;
            const newZ = result.x * sin + result.z * cos;
            result.x = newX;
            result.z = newZ;
        }
        
        // Rotate around X axis (pitch)
        if (rotation.x !== 0) {
            const cos = Math.cos(-rotation.x);
            const sin = Math.sin(-rotation.x);
            const newY = result.y * cos - result.z * sin;
            const newZ = result.y * sin + result.z * cos;
            result.y = newY;
            result.z = newZ;
        }
        
        return result;
    }
}