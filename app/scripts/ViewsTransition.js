class ViewsTransition 
{
    constructor(newPageName, oldDOMView, newDOMView, transitionOutClass, transitionInClass, classInstances = null)
    {
        this.oldDOMView = document.querySelectorAll('.' + oldDOMView)
        this.$body = document.querySelector('body')
        this.classes = classInstances
        console.log(this.classes)

        setTimeout(() => 
        {
            this.oldDOMView[0].classList.add(transitionOutClass[0])
        }, 300)

        for(let i = 1; i < this.oldDOMView.length; i++) 
        {
            this.oldDOMView[i].classList.remove(transitionOutClass[i])
        }

        setTimeout(() => 
        { 
            this.oldDOMView[0].remove() 

            let views = this.getPage(`views/${newPageName}.html`, 'body', 'body')

            if(views != undefined)
            {
                views = document.querySelectorAll('.' + newDOMView)
                console.log('VIEWS NEW : ' + views)
                for(const view of views) { view.classList.add('preTransition') }
                setTimeout(() => 
                { 
                    for(let i = 0; i < views.length; i++) 
                    {
                        for(const view of views) { view.classList.remove('preTransition') }
                        views[i].classList.add(transitionInClass[i]) 
                    }

                    for(const classInstance of this.classes) 
                    {
                        console.log(classInstance)
                        let drumKit = ''
                        let calibration = ''

                        // classInstance == 'MusicalCanvas' ? drumKit = new DrumKit() : false
                        classInstance == 'Calibration' ? calibration = new Calibration() : false
                        new Rooter()
                    }
                }, 10)
            }
        }, 1000)
    }
    getPage(url, from, to)
    {
        const cached = sessionStorage[url]
        if(!from){from="body"} // default to grabbing body tag
        if(to && to.split){to = document.querySelector(to)} // a string TO turns into an element
        if(!to){to = document.querySelector(from)} // default re-using the source elm as the target elm
        if(cached){return to.innerHTML = cached} // cache responses for instant re-use re-use

        const XHRt = new XMLHttpRequest // new ajax
        XHRt.responseType = 'document'  // ajax2 context and onload() event
        XHRt.onload = () => { sessionStorage[url] = to.innerHTML = XHRt.response.querySelector(from).innerHTML}
        XHRt.open("GET", url, true)
        XHRt.send()
        return XHRt
    }
}