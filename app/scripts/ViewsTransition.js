class ViewsTransition 
{
    constructor(newPageName, oldDOMView, newDOMView, transitionOutClass, transitionInClass, classInstances = null)
    {
        this.oldDOMView = document.querySelectorAll('.' + oldDOMView)
        this.newDOMView = newDOMView
        this.transitions = transitionInClass
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
        
        // document.body.addEventListener('DOMSubtreeModified', () => 
        // { 
            //     console.log('MODIFI')
            //     document.body.addEventListener('DOMContentLoaded', () => 
            //     {
                //         console.log('LOADEEEEEEE')
                //     })
                // })
        setTimeout(() => 
        { 
            this.oldDOMView[0].remove() 

            let views = this.getPage(`views/${newPageName}.html`, 'body', 'body')
            // this.newViews = []

            if(views != undefined)
            {
                console.log(newDOMView)
                // do
                // {
                //     this.newViews = document.querySelectorAll('.' + newDOMView)
                //     console.log(this.newViews)
                // } while(this.newViews.length == 0)

                // this.newViews = document.querySelectorAll('.' + newDOMView)

                // Try to catch new dom elements
                console.log(transitionInClass)
                const newViews = this.tryCatchDOM(newDOMView, transitionInClass)

                console.log(newViews)
                
                // console.log('VIEWS NEW : ' + views)
                // for(const view of views) { view.classList.add('preTransition') }
                // setTimeout(() => 
                // { 
                //     for(let i = 0; i < views.length; i++) 
                //     {
                //         for(const view of views) { view.classList.remove('preTransition') }
                //         views[i].classList.add(transitionInClass[i]) 
                //     }

                //     for(const classInstance of this.classes) 
                //     {
                //         console.log(classInstance)
                //         let drumKit = ''
                //         let calibration = ''

                //         // classInstance == 'MusicalCanvas' ? drumKit = new DrumKit() : false
                //         classInstance == 'Calibration' ? calibration = new Calibration() : false
                //         new Rooter()
                //     }
                // }, 10)
            }
        }, 1000)
    }

    tryCatchDOM(viewsClass)
    {
        const newViews = document.querySelectorAll('.' + viewsClass)

        if(newViews.length == 0)
        {
            console.log('TESTOS')
            setTimeout(() => 
            {
                this.tryCatchDOM(viewsClass)
            }, 50)         
        }
        else
        {
            this.toggleClass(newViews)
            return newViews
        } 
    }

    toggleClass(newViews)
    {
        const views = newViews

        if(views != undefined)
        {
            // for(const view of views) { view.classList.add('preTransition') } 

            setTimeout(() => 
            { 
                for(let i = 0; i < views.length; i++) 
                {
                    // console.log(transitionInClass)
                    // console.log(i)
                    // views[i].classList.remove('preTransition')
                    console.log(this.transitions[i])
                    views[i].classList.add(this.transitions[i])
                    // views[i].classList.add('coucou') 
                }
                // views[1].classList.add(this.transitions[1]) 
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
        else
        {
            this.toggleClass(views, transitionInClass)
        }
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