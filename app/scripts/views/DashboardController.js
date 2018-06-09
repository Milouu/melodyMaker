class DashboardController
{
    constructor()
    {   
        this.box1 = document.querySelector('.box-1')
        this.end = false 
    }
    add()
    {
        
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