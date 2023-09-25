const DVD_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" class="dvdLogo" stroke="currentColor" fill="currentColor" width="100%" height="100%" viewBox="0 0 210 107">
<path
    d="M118.895,20.346c0,0-13.743,16.922-13.04,18.001c0.975-1.079-4.934-18.186-4.934-18.186s-1.233-3.597-5.102-15.387H81.81H47.812H22.175l-2.56,11.068h19.299h4.579c12.415,0,19.995,5.132,17.878,14.225c-2.287,9.901-13.123,14.128-24.665,14.128H32.39l5.552-24.208H18.647l-8.192,35.368h27.398c20.612,0,40.166-11.067,43.692-25.288c0.617-2.614,0.53-9.185-1.054-13.053c0-0.093-0.091-0.271-0.178-0.537c-0.087-0.093-0.178-0.722,0.178-0.814c0.172-0.092,0.525,0.271,0.525,0.358c0,0,0.179,0.456,0.351,0.813l17.44,50.315l44.404-51.216l18.761-0.092h4.579c12.424,0,20.09,5.132,17.969,14.225c-2.29,9.901-13.205,14.128-24.75,14.128h-4.405L161,19.987h-19.287l-8.198,35.368h27.398c20.611,0,40.343-11.067,43.604-25.288c3.347-14.225-11.101-25.293-31.89-25.293h-18.143h-22.727C120.923,17.823,118.895,20.346,118.895,20.346L118.895,20.346z" />
<path
    d="M99.424,67.329C47.281,67.329,5,73.449,5,81.012c0,7.558,42.281,13.678,94.424,13.678c52.239,0,94.524-6.12,94.524-13.678C193.949,73.449,151.664,67.329,99.424,67.329z M96.078,85.873c-11.98,0-21.58-2.072-21.58-4.595c0-2.523,9.599-4.59,21.58-4.59c11.888,0,21.498,2.066,21.498,4.59C117.576,83.801,107.966,85.873,96.078,85.873z" />
</svg>
`.trim();

const screenElement = document.querySelector("main#screen");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
    // The maximum is exclusive and the minimum is inclusive
}

function getRandomBit() {
    return Math.round(Math.random());
}

function getRandomScreenPosition() {
    const { width, height } = screenElement.getBoundingClientRect();
    return {
        x: getRandomInt(0, width/2),
        y: getRandomInt(0, height/2),
    }
}

function getRandomHexColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function getRandomVector(n = 1) {
    return {
        x: (getRandomBit()? -1: 1) * n,
        y: (getRandomBit()? -1: 1) * n,
    }
}

class DvdLogo {

    constructor(x = 0, y = 0) {
        const parser = new DOMParser();
        this.element = parser.parseFromString(DVD_SVG, 'text/html').body.firstChild;
        this.id = (new Date()).getTime();
        this.element.id = this.id;
        this.changeColor();
        this.position = { x, y };
    }

    get container() {
        return this.element.parentElement;
    }

    get clientRect() {
        return this.element.getBoundingClientRect();
    }

    get position() {
        const { x, y } = this.clientRect;
        return { x, y };
    }

    set position({x, y}) {
        this.element.style.top = y;
        this.element.style.left = x;
    }

    move({ x, y }) {
        this.position = {
            x: this.position.x + x,
            y: this.position.y + y,
        };
    }

    changeColor() {
        this.element.style.color = getRandomHexColor();
    }

    get axisTouched() {
        const { x, y, height, width } = this.clientRect;
        const [x1, y1] = [x + width, y + height];

        const containerRect = this.container.getBoundingClientRect();

        return {
            x: x < containerRect.x || x1 > containerRect.x + containerRect.width,
            y: y < containerRect.y || y1 > containerRect.y + containerRect.height,
        };
    }

    get isOutOfBounds() {
        return Object.values(this.axisTouched).some(Boolean);
    }
}

function main() {
    
    const dvdLogo = new DvdLogo();
    dvdLogo.position = getRandomScreenPosition();
    screenElement.appendChild(dvdLogo.element);

    const vector = getRandomVector();

    setInterval(() => {

        dvdLogo.move(vector);

        if(dvdLogo.isOutOfBounds) {
            const bounds = dvdLogo.axisTouched;
            
            if(bounds.x)
                vector.x = -vector.x;
            if(bounds.y)
                vector.y = -vector.y;
            
            dvdLogo.changeColor();
        }
        
    }, 10);
}

main();