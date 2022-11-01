import { el, getEl, getQueryString, globalMsg, make_input, put_inside, removeQueryString, setQueryString } from "../tools/helper.js"
import { getLocalStorageData, registerKey, setLocalStorageData } from "../tools/l_storage.js"
import { go_on_article } from "./view_article.js"

const article = el(null, 'div', {className : 'article__section'})
const article_wrapper = el(article, 'div', { className : 'article__wrapper'})
const title = el(null, 'div', {className: 'article__title', innerHTML : 'Create Your Article here'})
const form = el(article_wrapper, 'form', {})
const topic = make_input({
    name : 'topic',
    value : 'you nice topic ??'
})
const submit_btn = el(null, 'input', {type:'submit', value : 'upload data -> article'})

const content = el(null, 'textarea', {
    className : 'article__content',
    placeholder : 'Write your awesome article here and go on fire !!!',
    rows : '20'
})

put_inside(form, [
    title,
    topic,
    content,
    submit_btn
])

article.onfire = page => {
    const edit_id = getQueryString('edit_article_id')
    if(edit_id != null ){
        console.log('edite called')
        edit_article(edit_id)
    }else {
        
    }
}

article.onleave = () => {
    return { removeQueries : ['article_id', 'edit_article_id'] }
}
// handling submit 
form.addEventListener('submit', e=> {
    e.preventDefault()
    const edit_id = getQueryString('edit_article_id')
    if(submit_btn.getAttribute('btn_work') == 'replace_article' && edit_id){
        replace_article(getEl('input', topic).value, content.value,edit_id )
        removeQueryString('edit_article_id')
        setQueryString('page', 'my-article')
        submit_btn.removeAttribute('btn_work')
        return ;
    }
    save_article(getEl('input', topic).value, content.value)
})


export function save_article(topic , content ){
    topic = topic.trim()
    content = content.trim()
    if(topic == '' || content == ''){
        globalMsg('Article fields Can not be blank! fill Every input field', true)
        return ;
    }
    const site_data = getLocalStorageData('site_data') ?? { article_count : 0}
    const articles = registerKey('articles')
    const session = getLocalStorageData('session')
    const new_article = {id: `art_id_${site_data.article_count++}`, topic, content, author : session.username }

    articles.insert(new_article)
    setLocalStorageData('site_data', site_data)
    globalMsg('Data has been saved !!!')
    form.reset()

}

export function replace_article(topic, content , id){
    topic = topic.trim()
    content = content.trim()
    if(topic == '' || content == ''){
        globalMsg('Article fields Can not be blank! fill Every input field', true)
        return ;
    }
    const articles = registerKey('articles')
    const session = getLocalStorageData('session')
    const site_data = getLocalStorageData('site_data') ?? { article_count : 0}
    let i = -1
    articles.find((element, index) => {
        i = index
        return element.id == id

    });
    const new_article = {id: `art_id_${site_data.article_count++}`, topic, content, author : session.username }
    articles[i] = new_article
    articles.save()
    setLocalStorageData('site_data', site_data)
    globalMsg('edited articles was saved !!!')
    form.reset()
    console.log(i)
}

export function edit_article(article_id){
    const article = registerKey('articles').find(item => item.id == article_id)
    if(!article)return;

    topic.children[0].value = article.topic
    content.value = article.content
    submit_btn.setAttribute('btn_work', 'replace_article')
}

export function article_card(article_obj){
    const content_html = article_obj.content.replaceAll("\n", '<br>')
    const card = el(null,'div', {className : 'article__card1'})
    el(card, 'div', {className : 'article__cardTopic' , innerHTML : article_obj.topic})
    el(card, 'div', {className : 'article__cardContent' , innerHTML : content_html})
    el(card, 'div', {className : 'article__cardAuther' , innerHTML : article_obj.author})
    return card
}

export function private_article_card(article_obj){
    const normal = article_card(article_obj)
    const options = el(normal,'div', {className: 'private__cardOptions'})
    const view_btn = el(options,'span', {innerHTML : 'View'})
    const edit_btn = el(options,'span', {innerHTML : 'Edit'})
    const delete_btn = el(options,'span', {innerHTML : 'Delete'})

    view_btn.addEventListener('click', ()=>{ // adding event listener on view btn
        go_on_article(article_obj.id)
    })

    // adding event listener on edit btn
    edit_btn.addEventListener('click', ()=>{
        setQueryString('edit_article_id', article_obj.id,{}, true)
        setQueryString('page', 'create-article')
    })

    delete_btn.addEventListener('click', (e)=> {
        if( confirm('Are you sure to Delete This Article ?? ') ){
            let del_index = delete_article(article_obj.id)
            if(del_index >= 0 ){
                globalMsg('Your article has been deleted')
                e.currentTarget.parentElement.parentElement.remove()
            }
        }
    })
    return normal
}

export function delete_article(id){
    const articles = registerKey('articles')
    let i = -1
    articles.forEach((item,index)=> {
        i = index
        return item.id == id
    }) // searching

    if(i >= 0){
        articles.remove(i)
    }
    return i
}

export default article