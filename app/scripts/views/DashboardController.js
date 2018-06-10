class DashboardController
{
    constructor()
    {   
        this.box1 = document.querySelector('.box-1')
        this.end = false 
    }
    add()
    {
        const timeline = new TimelineMax({onComplete: this.instances, onCompleteScope: this})

        timeline 
            .from(".dashboard", 0.5, {scale: 0, ease: Power3.easeOut})
            .from(".dashboard__add", 0.2, {scaleX: 0})
            .from(".dashboard__addPlus", 0.2, {scale: 0}, '-=0.1')
            .from(".dashboard__reset", 0.2, {scale: 0})
            .from(".dashboard__seperator", 0.1, {opacity: 0})
            .from(".dashboard__play", 0.2, {scale: 0})
            .from(".dashboard__trackInstrument", 0.3, {y: -100, opacity: 0}, '-=0')
            .from(".dashboard__track", 0.3, {scaleX: 0, ease: Power1.easeOut})
            .from(".dashboard__userPictureImg", 0.2, {scaleX: 2}, '-=0.1')
            .from(".dashboard__userPicture", 0.2, {x: -100, scaleX: 0}, '-=0.2')
            .from(".dashboard__cursor", 0.3, {x: 600, opacity: 0})
            .staggerFrom(".dashboard__metric", 0.2, {scaleY: 0}, 0.1)
    }
    remove()
    {
        // const timeline = new TimelineMax({onComplete: this.ending, onCompleteScope: this })
        
        // timeline
        // .to(".content", 2, {opacity: 0, scale: 4, x: 600, ease:Elastic.easeOut}, 0.1)
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