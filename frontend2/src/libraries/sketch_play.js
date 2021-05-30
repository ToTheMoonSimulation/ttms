import P5 from 'p5'

function createP5(parentId, w, h, backgroundColor) {
    const sketch = p => {
        p.setup = () => {
            p.noLoop();
            p.createCanvas(w, h);
        }
        p.draw = () => {
            p.background(backgroundColor);
        }
    }
    return new P5(sketch, parentId);
}

export default createP5;