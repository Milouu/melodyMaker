class ViewsController
{
    constructor(newPageName, instance = false)
    {
        // Set variables
        this.oldDOMView = document.querySelector('.view')
        this.newPageName = newPageName
        // this.page = null

        // If page is the first (home for example), not of DOM to remove
        instance ? this.initNewDOM() : this.removeOldDOM()
    }

    removeOldDOM()
    {
        console.log(this.page)
        // Instant pageOne
        this.newPageName == 'home' ? this.page = new DashboardController() : false
        this.newPageName == 'calibration' ? this.page = new HomeController() : false
        this.newPageName == 'dashboard' ? this.page = new CalibrationController() : false
        console.log(this.page)

        // Animate removing elements
        this.page.remove()

        // Call remove
        this.remove()
    }

    initNewDOM()
    {
        // Takes the DOM of new page and inject it into current view 
        this.getPage(`views/${this.newPageName}.html`, 'container', 'container')
        
        // Try to catch new dom elements
        this.tryCatchDOM()
    }

    remove()
    {
        // Store state of animations: end or not ?
        const end = this.page.endRemove()

        setTimeout(() => 
        {
            // end ?
            if(end == false) 
            {
                // Calls herself to looping
                this.remove()
            }
            else
            {
                // Delete old view
                this.oldDOMView.remove() 

                // Init new view
                this.initNewDOM()
            }
        }, 0) // Trick to prevent Maximum call stack size 
    }
    
    tryCatchDOM()
    {
        const newView = document.querySelector('.view')
        console.log(newView)

        newView == null ? setTimeout(() => { this.tryCatchDOM()}, 50) : this.pageProperty(newView)
    }

    pageProperty(newView)
    {
        // newView ready to display
        newView.style.opacity = '1'
        
        // Check which instance to do
        console.log('INSTANCE PAGE')
        this.newPageName == 'home' ? this.page = new HomeController() : false
        this.newPageName == 'home' ? this.page.add() : false
        this.newPageName == 'calibration' ? this.page = new CalibrationController() : false
        this.newPageName == 'calibration' ? this.page.add() : false
        this.newPageName == 'dashboard' ? this.page = new DashboardController() : false
        this.newPageName == 'dashboard' ? this.page.add() : false
        // Reset Rooter
        new Rooter()     
    }

    getPage(url, from, to)
    {
        const cached = sessionStorage[url]
        if(!from){from="body"} // Default to grabbing body tag
        if(to && to.split){to = document.querySelector(to)} // A string TO turns into an element
        if(!to){to = document.querySelector(from)} // Default re-using the source elm as the target elm
        if(cached){return to.innerHTML = cached} // Cache responses for instant re-use re-use

        const XHRt = new XMLHttpRequest // New ajax
        XHRt.responseType = 'document'  // Ajax2 context and onload() event
        XHRt.onload = () => { sessionStorage[url] = to.innerHTML = XHRt.response.querySelector(from).innerHTML}
        XHRt.open("GET", url, true)
        XHRt.send()
        return XHRt
    }
}