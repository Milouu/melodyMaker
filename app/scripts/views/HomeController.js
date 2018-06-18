class HomeController
{
    constructor()
    {   
        this.box1 = document.querySelector('.box-1')
        this.newViewButton = document.querySelector('.newViewButton')
        this.end = false 
    }
    add()
    {
        // Instant instances
        this.canvas = new WavesCanvas('content__jelly', 'img')
        
        const video = document.querySelector('.img')
        video.volume = 0
        
        const timeline = new TimelineMax({onComplete: this.instances, onCompleteScope: this})

        timeline 
        .from(".content__title", 0.6, {opacity: 0, x: 100})
        .from(".content__description", 0.6, {opacity: 0, x: 100}, '-=0.1')
        .from(".jelly", 0.3, {opacity: 0, scale: 0})
        
        .from('.header__title', 1, {rotation: 0, y: '-120%', opacity: 0}, 'start')
        .from('.track', 1, {rotation: 0, x: '50%', y: '-100%', opacity: 0}, 'start')
        .from('.drum', 1, {rotation: 0, x: '-120%', y: '50%', opacity: 0}, 'start')
        .from('.loop', 1, {rotation: 0, x: '150%', y: '80%', opacity: 0}, 'start')
        .from(".hoverButton", 0.3, {opacity: 0, scale: 0})
    }
    remove()
    {
        this.canvas.stop()
        const timeline = new TimelineMax({onComplete: this.ending, onCompleteScope: this })
        
        timeline 
        .to(".content", 0.3, {opacity: 0})
        .to(".hoverButton__access", 0.1, {opacity: 0})
        .to(".hoverButton", 0.3, {opacity: 0, scale: 0})

        .to('.header__title', 1, {rotation: 0, y: '-120%', opacity: 0}, 'start')
        .to('.track', 1, {rotation: 0, x: '50%', y: '-100%', opacity: 0}, 'start')
        .to('.drum', 1, {rotation: 0, x: '-120%', y: '50%', opacity: 0}, 'start')
        .to('.loop', 1, {rotation: 0, x: '150%', y: '80%', opacity: 0}, 'start')

        
    }
    instances()
    {
        new organicButton('hoverButton__container', 'hoverButton', 'hoverButton__expendContainer', 'hoverButton__background','hoverButton__background--climb')
    }
    ending()
    {
        this.end = true
    }
    endRemove()
    {
        return this.end
    }
}