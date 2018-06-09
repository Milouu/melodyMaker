class Rooter
{
    constructor()
    {
        // Set next button
        this.viewsController = new ViewsController()
        
        this.currentPageName = 'home'
        this.viewsController.initNewDOM(this.currentPageName)

        this.tryCatchNewViewButton()

        // // Listening click event on next button
        // nextButton.addEventListener('mousedown', () => 
        // {
        //     // Recovers page name with data-name
        //     const pageName = nextButton.dataset.name
        //     console.log(pageName)
        //     if(nextButton.classList.contains('newViewButton--delay'))
        //     {
        //         console.log('DELAY')
        //         let mouseUp = false

        //         nextButton.addEventListener('mouseup', () => 
        //         {
        //             mouseUp = true
        //         })

        //         setTimeout(() => 
        //         {
        //             if(!mouseUp) { new ViewsController(pageName) }
        //         }, 1000)
        //     }
        //     else
        //     {
        //         // Instance of ViewsTransition
        //         new ViewsController(pageName) // essayer de ne pas re instancier viewscotroller car reset this.page
        //     }

        // })
    }
    tryCatchNewViewButton()
    {
        const newViewButton = this.viewsController.newViewButton()

        if(newViewButton == undefined)
        {
            setTimeout(() => 
            {
                this.tryCatchNewViewButton()
            }, 50)
        }
        else
        {
            this.events(newViewButton)
        }
    }
    events(newViewButton)
    {
        newViewButton.addEventListener('click', () => 
        {
            const newPageName = newViewButton.dataset.name

            this.viewsController.removeOldDOM(this.currentPageName, newPageName)

            this.currentPageName = newPageName

            this.isEnding()
        })
    }
    isEnding()
    {
        const ending = this.viewsController.ending()
        
        if(!ending)
        {
            setTimeout(() => 
            {
                this.isEnding()
            }, 50)
        }
        else
        {
            this.tryCatchNewViewButton()
        }
    }

}