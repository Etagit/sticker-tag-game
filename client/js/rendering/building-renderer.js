class BuildingRenderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
    }
    
    render(position, size, height, depthBuffer) {
        const halfSize = size / 2;
        
        // Define cube vertices with custom height
        const vertices = [
            new Vector3(position.x - halfSize, position.y - height/2, position.z - halfSize), // 0
            new Vector3(position.x + halfSize, position.y - height/2, position.z - halfSize), // 1
            new Vector3(position.x + halfSize, position.y + height/2, position.z - halfSize), // 2
            new Vector3(position.x - halfSize, position.y + height/2, position.z - halfSize), // 3
            new Vector3(position.x - halfSize, position.y - height/2, position.z + halfSize), // 4
            new Vector3(position.x + halfSize, position.y - height/2, position.z + halfSize), // 5
            new Vector3(position.x + halfSize, position.y + height/2, position.z + halfSize), // 6
            new Vector3(position.x - halfSize, position.y + height/2, position.z + halfSize)  // 7
        ];
        
        // Project vertices to screen space
        const screenVertices = vertices.map(v => this.camera.worldToScreen(v));
        
        // Check if any vertices are visible
        if (screenVertices.every(v => v === null)) return;
        
        this.renderFaces(vertices, screenVertices, depthBuffer);
    }
    
    renderFaces(vertices, screenVertices, depthBuffer) {
        const faces = [
            { indices: [0, 3, 2, 1], normal: new Vector3(0, 0, -1), name: 'front' },
            { indices: [5, 6, 7, 4], normal: new Vector3(0, 0, 1), name: 'back' },
            { indices: [4, 7, 3, 0], normal: new Vector3(-1, 0, 0), name: 'left' },
            { indices: [1, 2, 6, 5], normal: new Vector3(1, 0, 0), name: 'right' },
            { indices: [3, 7, 6, 2], normal: new Vector3(0, 1, 0), name: 'top' },
            { indices: [4, 0, 1, 5], normal: new Vector3(0, -1, 0), name: 'bottom' }
        ];
        
        const baseColor = '#A9A9A9';
        const faceColors = {
            front: baseColor,
            back: MathUtils.adjustBrightness(baseColor, -30),
            left: MathUtils.adjustBrightness(baseColor, -15),
            right: MathUtils.adjustBrightness(baseColor, -15),
            top: MathUtils.adjustBrightness(baseColor, 20),
            bottom: MathUtils.adjustBrightness(baseColor, -40)
        };
        
        faces.forEach((face) => {
            const faceVertices = face.indices.map(i => screenVertices[i]).filter(v => v !== null);
            
            if (faceVertices.length >= 3) {
                const faceCenter = face.indices.reduce((sum, i) => {
                    return sum.add(vertices[i]);
                }, new Vector3()).multiply(1/4);
                
                const toCameraDir = this.camera.position.subtract(faceCenter).normalize();
                const dotProduct = face.normal.dot(toCameraDir);
                
                if (dotProduct > 0) {
                    const avgDepth = faceVertices.reduce((sum, v) => sum + v.z, 0) / faceVertices.length;
                    
                    depthBuffer.push({
                        depth: avgDepth,
                        draw: () => this.drawFace(faceVertices, faceColors[face.name], baseColor, face.name, avgDepth)
                    });
                }
            }
        });
    }
    
    drawFace(faceVertices, fillColor, baseColor, faceName, depth) {
        this.ctx.fillStyle = fillColor;
        this.ctx.strokeStyle = MathUtils.adjustBrightness(baseColor, -50);
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        this.ctx.moveTo(faceVertices[0].x, faceVertices[0].y);
        faceVertices.slice(1).forEach(v => this.ctx.lineTo(v.x, v.y));
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Add building windows
        if ((faceName === 'front' || faceName === 'left' || faceName === 'right') && faceVertices.length === 4) {
            this.drawWindows(faceVertices, faceName, depth);
        }
    }
    
    drawWindows(faceVertices, faceName, depth) {
        if (depth > 30) return;
        
        const width = Math.abs(faceVertices[1].x - faceVertices[0].x);
        const height = Math.abs(faceVertices[2].y - faceVertices[1].y);
        
        if (width < 40 || height < 40) return;
        
        const windowColor = '#2C5F2D';
        const windowSize = Math.max(4, Math.min(width * 0.1, height * 0.1));
        
        const centerX = faceVertices.reduce((sum, v) => sum + v.x, 0) / 4;
        const centerY = faceVertices.reduce((sum, v) => sum + v.y, 0) / 4;
        
        const windowSpacing = windowSize * 2.5;
        const windowsX = Math.floor(width / windowSpacing);
        const windowsY = Math.floor(height / windowSpacing);
        
        for (let x = 0; x < windowsX; x++) {
            for (let y = 0; y < windowsY; y++) {
                const offsetX = (x - windowsX/2 + 0.5) * windowSpacing;
                const offsetY = (y - windowsY/2 + 0.5) * windowSpacing;
                
                this.ctx.fillStyle = windowColor;
                this.ctx.fillRect(
                    centerX + offsetX - windowSize/2,
                    centerY + offsetY - windowSize/2,
                    windowSize,
                    windowSize
                );
                
                this.ctx.strokeStyle = '#8B8B8B';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(
                    centerX + offsetX - windowSize/2,
                    centerY + offsetY - windowSize/2,
                    windowSize,
                    windowSize
                );
            }
        }
    }
}