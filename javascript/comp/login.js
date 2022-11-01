import { setLocationChangeEvent } from "../tools/customEvents.js"
import { el, getEl, getEls, getQueryString, globalMsg, make_input, put_inside, removeQueryString, setQueryString, showInputError } from "../tools/helper.js"
import { getLocalStorageData, registerKey, setLocalStorageData } from "../tools/l_storage.js"

// this element will refer to the login form 
const login_page = el(null, 'div', { className : 'login__page'})
const form = el(login_page , 'form', {className : 'login__form'})
const signup_comp = el(null,'div',{ className : 'signup-comp'})
const signup_link = `New User ? <a href='signup-link'>Sign up </a>Now`

form.setAttribute('purpose', 'login-user') // to figure what form is doing 

put_inside(form, [
    make_input({ name : 'username', value : 'your username'}, {}),
    signup_comp,
    make_input({ name : 'password', value : 'your password'}, {}),
    el(null, 'input', {type: 'submit', value : 'login now'}),
    el(null, 'div', {innerHTML : signup_link, className : 'signup-linkDiv' })

])

// insertin sign inputs fields inside form
const signuo_field = [
    make_input({ name : 'email', value : 'your Email'}, {}),
    make_input({ name : 'mobile', value : 'your Mobile'}, {}),
    make_input({ name : 'sign-password', value : 'your password'}, {}),
]


login_page.onfire = onfire
setUpSignupLink() // because user will land on login page 
// thats why we are setting up sign up links

// handle with care
export function setUpSignupLink(){
    // to provide signup page
    getEl('[href=signup-link]', form).addEventListener('click', e=> {
        e.preventDefault()
        setQueryString('page', 'signup')
    })
}


// handle with care
// we have addeventlistener everytime because we are replacing the main link tag each time 
export function setUpLoginLink(){
    // to provide signup page
    getEl('[href=login-link]', form).addEventListener('click', e=> {
        e.preventDefault()
        setQueryString('page', 'login')
    })
}

function addEvents(){
    login_page.addEventListener('click' , e => removeQueryString('page'))
    form.addEventListener('click' , e => e.stopPropagation())
    form.addEventListener('submit' , e => {
        e.preventDefault()
        handleSubmit( form.getAttribute('purpose'))
    })
}
addEvents()

function onfire(){
    let session = getLocalStorageData('session')
    if(session){
        globalMsg('already logged in _> Log-out first ', true)
        removeQueryString('page')
        return
    }
    getQueryString('page') === 'signup' ? showSignup() : showLogin()
}

export function handleSubmit(purpose){
    const inps = getEls('input', form )
    const db_users = registerKey('db_users')
    const session = getLocalStorageData('session')
    let is_valid = validateInput(inps)

    if(!is_valid){
        form.style.border = '2px solid red'
        return ;
    }
    
    form.style.border = '2px solid green'
    if( purpose === 'login-user'){
        let username = inps[0].value
        let password = inps[1].value
        const curr_user = db_users.find(user => user.username == username && user.password == password)
        if(curr_user){
            setLocalStorageData('session',curr_user)
            globalMsg('Logged-in Successfully :)')
            form.reset()
            removeQueryString('page')
            // console.log(session[0].dp)
            window.dispatchEvent(new CustomEvent('dp_change', {
                detail : { dp_url : curr_user?.dp}
            }))
        }else {
            globalMsg('Cant find user -- Invalid User', true)
        }
        return true
    }
    // saving users data
    const new_user = {
        username : inps[0].value,
        email    : inps[1].value,
        mobile   : inps[2].value,
        password : inps[3].value,
    }

    // checking if user already exists
    const check = db_users.find( user => user.username == new_user.username )
    if(check){
        globalMsg('username is already registered . Try another', true)
        return false
    }
    db_users.insert(new_user )
    form.reset()
    globalMsg('Account has been created !! Please login Now :)  ')
    return true
}


export function showSignup(){
    // let link = (getEl('[href="signup-link"]', form))
    // link?.click()
    getEl('.signup-linkDiv').innerHTML = `have account ? <a href='login-link'>Log in </a>Now`
    put_inside(signup_comp, signuo_field)
    let sibling_div = signup_comp.nextElementSibling
    
    sibling_div.children[0].name = 'confirm-password'
    sibling_div.children[1].innerHTML = 'confirm password'
    sibling_div.nextElementSibling.value = 'sign up' // submit btn

    form.setAttribute('purpose', 'signup-user')
    // some addition things
    setUpLoginLink()
}

export function showLogin(){
    // let link = (getEl('[href="login-link"]', form))
    // link?.click()
    getEl('.signup-linkDiv').innerHTML = signup_link
    let sibling_div = signup_comp.nextElementSibling
    sibling_div.children[0].name = 'password'
    sibling_div.children[1].innerHTML = 'your password'
    sibling_div.nextElementSibling.value = 'login now' // submit btn
    form.setAttribute('purpose', 'login-user')
    // some addition things
    signup_comp.innerHTML = ''
    setUpSignupLink()
}

// registering a user into the database __> in my case (LocalStorage)
export function registerUser(new_user){
    
}


// to validate form data
export function validateInput(inps){
    let all_good = true
    let username = inps[0].value?.trim()
    // validating username
    if(username == null || username == ''){
        showInputError(inps[0].parentElement, 'Enter Some Value')
        all_good = false
    }else if(username.length < 4){
        showInputError(inps[0].parentElement, 'Minimum 4 charecters Required for username ')
        all_good = false
    }  
    // validating password
    let password = inps[inps.length-2].value.trim()
    if(password == null || password == ''){
        showInputError(inps[inps.length-2].parentElement, 'password can not be blank')
        all_good = false
    }else if(password.length < 6){
        showInputError(inps[inps.length-2].parentElement, 'password must be more than 6 chars')
        all_good = false
    }

    // signup form validation begins here
    if(form.getAttribute('purpose') !== 'signup-user') return all_good
    
    let email = inps[1].value.trim()
    if(email == null || email == '' || email.length < 4){
        showInputError(inps[1].parentElement, 'Invalid email , must be atleast 4 chars')
        all_good = false
    }

    let mobile = inps[2].value.trim()
    if(mobile == null || mobile == '' || mobile.length < 4){
        showInputError(inps[2].parentElement, 'invalid mobile no , must be atleast 4 chars')
        all_good = false
    }

    let password1 = inps[3].value.trim()
    if(password1 == null || password1 == ''){
        showInputError(inps[3].parentElement, 'password can not be blank')
        all_good = false
    }else if(password1.length < 6){
        showInputError(inps[3].parentElement, 'password must be more than 6 chars')
        all_good = false
    }else if(password1 !== password){
        showInputError(inps[3].parentElement, 'password and confirm password does not match')
        all_good = false
    }

    return all_good
}

// showInputError(form.children[0], 'This Username Is Not Allowed !')

export default login_page