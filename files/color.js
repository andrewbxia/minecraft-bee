export class Color {
    static DEFAULT_COLOR = "#000000";
    rgba;

    constructor(str) {
        this.setColor(str || Color.DEFAULT_COLOR);
    }

    setColor(str) {
        try {
            const option = new Option();
            option.style.color = str;
            this.rgba = option.style.color;
        } catch (e) {
            throw new Error(`Invalid color string: ${str}`);
        }
    }

    getColor() {
        return this.rgba;
    }
}

// export default Color;