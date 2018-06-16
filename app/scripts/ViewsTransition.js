class ViewsController
{
	constructor()
	{
		this.home = new HomeController()
		this.calibration = new CalibrationController()
		this.dashboard = new DashboardController()
		this.recordingDrum = new RecordingDrum()
        
		this.newPageName = null
		this.oldDOMView = null
		this.currentPage = null

		this.end = false
	}

	removeOldDOM(currentPageName, newPageName)
	{
		this.end = false

		this.newPageName = newPageName

		if(currentPageName == 'home') this.currentPage = this.home
		if(currentPageName == 'calibration') this.currentPage = this.calibration
		if(currentPageName == 'dashboard') this.currentPage = this.dashboard
		if(currentPageName == 'recordingDrum') this.currentPage = this.recordingDrum

		// Animate removing elements
		this.currentPage.remove()

		// Call remove
		this.remove()
	}

	initNewDOM(newPageName)
	{
		this.newPageName = newPageName
		// Takes the DOM of new page and inject it into current view 
		this.getPage(`views/${newPageName}.html`, 'container', 'container')
        
		// Try to catch new dom elements
		this.tryCatchDOM()
	}

	remove()
	{
		// Store state of animations: end or not ?
		const end = this.currentPage.endRemove()

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
				this.initNewDOM(this.newPageName)
			}
		}, 0) // Trick to prevent Maximum call stack size 
	}
    
	tryCatchDOM()
	{
		const newView = document.querySelector('.view')

		newView == null ? setTimeout(() => { this.tryCatchDOM()}, 50) : this.pageProperty(newView)
	}

	pageProperty(newView)
	{
		this.oldDOMView = newView

		// newView ready to display
		newView.style.opacity = '1'
        
		// Check which instance to do
		this.newPageName == 'home' ? this.home.add() : false
		this.newPageName == 'calibration' ? this.calibration.add() : false
		this.newPageName == 'dashboard' ? this.dashboard.craftTracks() : false
		
		if(this.newPageName == 'recordingDrum')
		{
			this.recordingDrum.add()
			this.recordingDrum.setPickedColor(this.getPickedColor())
		}   

		this.end = true
	}
	newViewButton()
	{
		return document.querySelector('.newViewButton')
	}
	getPage(url, from, to)
	{
		// Cache commented for dev
		// const cached = sessionStorage[url]
		if(!from){from="body"} // Default to grabbing body tag
		if(to && to.split){to = document.querySelector(to)} // A string TO turns into an element
		if(!to){to = document.querySelector(from)} // Default re-using the source elm as the target elm
		// if(cached){return to.innerHTML = cached} // Cache responses for instant re-use re-use

		const XHRt = new XMLHttpRequest // New ajax
		XHRt.responseType = 'document'  // Ajax2 context and onload() event
		XHRt.onload = () => { sessionStorage[url] = to.innerHTML = XHRt.response.querySelector(from).innerHTML}
		XHRt.open("GET", url, true)
		XHRt.send()
		return XHRt
	}
	ending()
	{
		return this.end
	}

	getPickedColor()
	{
		return this.calibration.getPickedColor()
	}

	getRecord()
	{
		return this.recordingDrum.getRecord()
	}

	setRecord()
	{
		this.dashboard.setRecord(this.getRecord())
	}
}