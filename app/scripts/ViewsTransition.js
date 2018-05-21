class ViewsTransition 
{
    constructor(oldDOMView, newDOMView, transitionOutClass, transitionInClass, classInstance = null)
    {
        this.oldDOMView = document.querySelectorAll('.' + oldDOMView)
        this.$body = document.querySelector('body')
        this.class = classInstance

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
        
            let view = this.getPage('http://localhost:3000/views/calibration.html', '.calibration', 'body')

            if(view != undefined)
            {
                view = document.querySelector('.' + newDOMView)

                setTimeout(() => 
                { 
                    classInstance == 'MusicalCanvas' ? new MusicalCanvas() : false
                    view.classList.add(transitionInClass) 
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