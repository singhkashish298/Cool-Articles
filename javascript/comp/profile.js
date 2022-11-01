import {el, globalMsg, put_inside, removeQueryString, setQueryString} from '../tools/helper.js'
import { getLocalStorageData, registerKey, setLocalStorageData } from '../tools/l_storage.js'
import { header_dp, header_username } from './header.js'



const profile_page = el(null, 'div', {className : 'profile__page', })
const profile_wrapper = el(profile_page, 'div',{className:'profile__wrapper'})
const dp = el(null, 'img', {className: 'dp__img', src : 'pics/no-profile.png',alt: 'dp' })
const profile_info = el(null, 'div', {className :'profile__info'})
let session = getLocalStorageData('session')
// const current_user = registerKey('session')[0]
const db_user = registerKey('db_users')
const file_selector = el(null, 'input', {type : 'file'})
const del_accountBtn = el(null, 'button', {innerHTML : 'Delete Account', className : 'del__accountBtn'})

put_inside(profile_wrapper, [
    put_inside(el(null, 'div', {className :'dp__section'}),[ dp ]),
    profile_info,
    put_inside(el(null, 'div', {className:'file__selectWrapper'}), [file_selector])
])

// setting profile info


if(session?.dp ){
    dp.src = session.dp
}

file_selector.oninput = e => {
    const files = file_selector.files[0]
    const file_reader = new FileReader()
    session = getLocalStorageData('session')

    file_reader.addEventListener('load', e => {
        const db_user = registerKey('db_users')
        const found = db_user.find(user => user.username == session?.username && user.password == session?.password)
        // console.log(found, db_user)
        const url = file_reader.result
        found.dp = url
        session.dp = url
        setLocalStorageData('session', session)
        db_user.save()
        window.dispatchEvent(new CustomEvent('dp_change', {
            detail : { dp_url : session?.dp}
        }))

    })
    console.log(files.type)
    if(files && files.type.includes('image')){
        file_reader.readAsDataURL(files)
    }else globalMsg('Please Select a photo')

}

// adding Event On dp change 
window.addEventListener('dp_change', e => {
    const session = getLocalStorageData('session')
    const dp_url = e.detail?.dp_url ?? 'pics/no-profile.png'
    header_username.innerHTML = session?.username ?? 'no-one'
    dp.src = dp_url
    header_dp.src = dp_url

})

// event listener on del_accountBtn 
del_accountBtn.addEventListener('click', ()=>{
    const users = registerKey('db_users')
    const session = getLocalStorageData('session')
    let i = -1
    users.find((item ,index)=> {
        i = index
        return item.username == session.username && item.password == session.password
    } )
    if(i >= 0 && confirm('Delete Account ? action non-Reversable ')){
        // deleting the articles
        if(confirm('Delete My All Articles Also ??')){
            let articles = registerKey('articles')
            articles = articles.filter(item => item.author !== session.username )
            setLocalStorageData('articles', articles)
        }
        
        users.remove(i)
        localStorage.removeItem('session')
        setQueryString('page', 'home')
    }

})

// getting called when profile page starts rendering
profile_page.onfire = (pagname)=>{
    // updating profile info
    const session = getLocalStorageData('session')
    
    profile_info.innerHTML = ''
    put_inside(profile_info , [
        `<div class='user_name'>${session.username}</div>`,
        `<div class='user_email'>Email : ${session.email}</div>`,
        `<div class='user_mobile'>Phone : ${session.mobile}</div>`,
        del_accountBtn,
    ])
}

export default profile_page