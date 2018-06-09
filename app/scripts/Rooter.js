class Rooter
{
    constructor()
    {
        // Set next button
        this.viewsController = new ViewsController()
        
        this.currentPageName = 'home'
        this.viewsController.initNewDOM(this.currentPageName)

        this.tryCatchNewViewButton()
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