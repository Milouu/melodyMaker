class RecordingDrum
{
    constructor()
    {   
        this.end = false 
        // this.addi = document.querySelector('.dashboard__add')
    }
    add()
    {
        console.log()
        const timeline = new TimelineMax({onComplete: this.instances, onCompleteScope: this})

        timeline 
            .staggerFrom('.drumkit', 0.5, {opacity: 0})
            .staggerFrom('.drumkit__img', 0.5, {scale: 0, ease: Power3.easeOut}, 0.1, '-=0.5')
            .from('.toolBar', 0.5, {y: '100%', ease: Power3.easeOut}, 0.5)
            .from('.header', 0.5, {y: '-120%', ease: Power3.easeOut}, 0.5)
            .from('.toolBar__timeline', 0.8, {scaleX: 0, transformOrigin: 'left', ease: Power1.easeOut}, 0.5)
            .from('.dashboard__cursor', 0.5, {x: 400, transformOrigin: 'bottom', ease: Power2.easeOut}, '-=0.7')
            .staggerFrom('.toolBar__metric', 0.2, {scaleY: 0, transformOrigin: 'bottom', ease: Power1.easeOut}, 0.1)
    }
    remove()
    {
        // const timeline = new TimelineMax({onComplete: this.ending, onCompleteScope: this })
        
        // timeline
        // .to('.content', 2, {opacity: 0, scale: 4, x: 600, ease:Elastic.easeOut}, 0.1)
    }
    instances()
    {
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