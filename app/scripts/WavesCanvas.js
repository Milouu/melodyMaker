class WavesCanvas 
{
    constructor(parentClass, videoClass) 
    {
        // Set DOM elements
        this.$parent = document.querySelector('.' + parentClass)
        this.$video = document.querySelector('.' + videoClass)
        this.$canvas = document.createElement('canvas')
        this.context = this.$canvas.getContext('2d')

        // Display none video
        this.$video.style.display = 'none'

        // Animation amplitude
        this.amplitude = {
            x: 20,
            y: 20
        }
        
        // Animation speed
        this.speed = 0.0005

        
        
        this.$canvas.width = this.$parent.offsetWidth
        this.$canvas.height = this.$parent.offsetHeight

        
        this.width = this.$canvas.width / 10
        this.height = this.$canvas.height / 10
        
        this.initalWidth = this.width
        this.initalHeight = this.height

        this.$parent.appendChild(this.$canvas)

        window.addEventListener('resize', () => {
            this.$canvas.width = this.$parent.offsetWidth
            this.$canvas.height = this.$parent.offsetHeight
        })

        this.$canvas.addEventListener('click', () => {
            this.wizz() 
        })
        this.animate()
    }
    draw()
    { 
        const pattern = this.context.createPattern(document.querySelector('.img'), "repeat");
        
        // const width = this.$canvas.width / 10
        // const height = this.$canvas.height / 10
        
        this.ratio = 
        {
            x: Math.sin(new Date() * this.speed) * this.amplitude.x,
            y:  Math.sin(new Date() * this.speed) * this.amplitude.y
        }

        this.context.beginPath()

        this.context.fillStyle = pattern;

        this.context.moveTo(this.width * 4 + this.ratio.x, 0 + Math.abs(this.ratio.y))

        this.context.bezierCurveTo(
        this.width * 6 + this.ratio.x, 0 + Math.abs(this.ratio.y),
        this.width * 6 + this.ratio.x, this.height + Math.abs(this.ratio.y),
        this.width * 7 + this.ratio.x, this.height * 2 + Math.abs(this.ratio.y),
        )

        this.context.bezierCurveTo(
        this.width * 8 + this.ratio.x, this.height * 3 + Math.abs(this.ratio.y),
        this.width * 10 - Math.abs(this.ratio.x), this.height * 3 + Math.abs(this.ratio.y),
        this.width * 10 - Math.abs(this.ratio.x), this.height * 6 + Math.abs(this.ratio.y),
        )

        this.context.bezierCurveTo(
        this.width * 10 - Math.abs(this.ratio.x), this.height * 9 + Math.abs(this.ratio.y),
        this.width * 7 + this.ratio.x, this.height * 9 + this.ratio.y,
        this.width * 6 + this.ratio.x, this.height * 9 + this.ratio.y,
        )

        this.context.bezierCurveTo(
        this.width * 5 + this.ratio.x, this.height * 9 + this.ratio.y,
        this.width * 4 + this.ratio.x, this.height * 10 - Math.abs(this.ratio.y),
        this.width * 3 + this.ratio.x, this.height * 10 - Math.abs(this.ratio.y),
        )

        this.context.bezierCurveTo(
        this.width + this.ratio.x, this.height * 10 - Math.abs(this.ratio.y),
        0 + Math.abs(this.ratio.x), this.height * 9 + this.ratio.y,
        0 + Math.abs(this.ratio.x), this.height * 7 + this.ratio.y
        )

        this.context.bezierCurveTo(
        0 + Math.abs(this.ratio.x), this.height * 5 + this.ratio.y,
        this.width + this.ratio.x, this.height * 5 + this.ratio.y,
        this.width + this.ratio.x, this.height * 3 + this.ratio.y,
        )

        this.context.bezierCurveTo(
        this.width + this.ratio.x, this.height + this.ratio.y,
        this.width * 2 + this.ratio.x, 0 + Math.abs(this.ratio.y),
        this.width * 4 + this.ratio.x, 0 + Math.abs(this.ratio.y),
        )

        this.context.fill()
        this.context.closePath()
    }
    wizz() {
        this.speed = 0.01

        setTimeout(() => {
            this.speed = 0.0005
        }, 700)
    }
    animate() {
        window.requestAnimationFrame(this.animate.bind(this))

        this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height)
        this.draw()
    }
}