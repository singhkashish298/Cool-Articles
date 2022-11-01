import { el, getEl, put_inside, setQueryString } from "../tools/helper.js"
import { registerKey } from "../tools/l_storage.js"
import { article_card } from "./article.js"

const home_content = el(null, 'div', { className : 'home__contentOuter'})
const home_contentinner = el(home_content, 'div', {className: 'home__content'})

home_content.onfire = page => {
    home_contentinner.innerHTML = ''
    const articles = registerKey('articles')
    const article_arr = articles.map((item)=> {
        const card = article_card(item) 
        card.addEventListener('click', e=> {
            e.stopPropagation()
            go_fullScreenArticle(item)
        })
        return card
    })

    put_inside(home_contentinner, article_arr.reverse())
}


function go_fullScreenArticle(item){
    setQueryString('article_id',item.id, {}, true)
    setQueryString('page','fullarticle')
}

export default home_content