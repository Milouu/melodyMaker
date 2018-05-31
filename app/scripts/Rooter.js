class Rooter 
{
    constructor() 
    {
        this.$callToAction = document.querySelector('.callToAction')
        console.log(this.$callToAction)
        this.$callToAction.addEventListener('click', () => 
        {
            console.log('docou')
            canvas.stop()
            new ViewsTransition('homeView', 'newView', ['transitionOut', 'track--animate', 'loop--animate', 'drum--animate', 'header__title--animate'], ['transitionIn', 'transitionTitle--display'], ['Calibration', 'MusicalCanvas'])
        })
    }
}