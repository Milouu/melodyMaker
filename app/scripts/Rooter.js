class Rooter
{
    constructor()
    {
        // Set next button
        const nextButton = document.querySelector('.newViewButton')

        // Listening click event on next button
        nextButton.addEventListener('mousedown', () => 
        {
            // Recovers page name with data-name
            const pageName = nextButton.dataset.name
            console.log(pageName)
            if(nextButton.classList.contains('newViewButton--delay'))
            {
                console.log('DELAY')
                let mouseUp = false

                nextButton.addEventListener('mouseup', () => 
                {
                    mouseUp = true
                })

                setTimeout(() => 
                {
                    if(!mouseUp) { new ViewsController(pageName) }
                }, 1000)
            }
            else
            {
                // Instance of ViewsTransition
                new ViewsController(pageName) // essayer de ne pas re instancier viewscotroller car reset this.page
            }

        })
    }
}