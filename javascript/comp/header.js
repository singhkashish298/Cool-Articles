import { el,makeList,put_inside,getEls,
     getEl, setQueryString, globalMsg, removeQueryString } from "../tools/helper.js"
import { getLocalStorageData, registerKey } from "../tools/l_storage.js"
import { toggleButton } from "../tools/snippets.js"
// imports ends here

let main_header_attr = {
    className : 'main__header'
}

const session = getLocalStorageData('session')
const main_header = el(null , 'header', main_header_attr )
const header_wrapper = el(main_header,'div',{className:'header__wrapper'})
const user_info = el(null, 'div', {className : 'header__userInfo'})
export const header_username = el(user_info, 'span',{
    className:'header__username', innerHTML : session?.username ?? 'no-one'
})

export const header_dp = el(user_info, 'img', {
    src : session?.dp ?? 'pics/no-profile.png' ,
    className : 'header__dp'
})

const theme_btn = toggleButton( status => {
    document.body.classList.toggle('dark__mode', status)
})

const nav_items = makeList([
    el( null, 'a',{innerHTML : 'Home', href : 'home'} ),
    el( null, 'a',{innerHTML : 'Login', href : 'login'} ),
    el( null, 'a',{innerHTML : 'profile', href : 'profile'} ),
    el( null, 'a',{innerHTML : 'My-Article', href : 'my-article'} ),
    user_info,
    el( null, 'a',{innerHTML : 'log-out', href : 'logout'} ),
    theme_btn,
    
], { className : 'nav__items'})

put_inside(header_wrapper, [nav_items,])


// putting event listener on links 
getEls('a', nav_items)?.forEach( l => {
    l.addEventListener('click', e => {
        e.preventDefault()
        const href = e.target.getAttribute('href')
        if(href == 'logout'){
            localStorage.removeItem('session')
            window.dispatchEvent(new CustomEvent('dp_change', {
                detail : { dp_url : null }
            }))
            globalMsg('Logged Out Successfully :')
            removeQueryString('page')
            window.dispatchEvent(new Event('location_change'))
            return ;
        }
        // return ;
        setQueryString('page',href)
    })
})

// adding event listener on header user_info
user_info.addEventListener('click', e=> {
    setQueryString('page', 'profile')
})


export default main_header
