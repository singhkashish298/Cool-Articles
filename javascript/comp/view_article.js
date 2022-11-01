import { el, getQueryString, globalMsg, put_inside, removeQueryString, setQueryString } from "../tools/helper.js";
import { registerKey } from "../tools/l_storage.js";
import article, { article_card } from "./article.js";

const full_article = el(null, 'div', {className : 'full__article',})
full_article.onfire = ()=> {
    full_article.innerHTML = ''
    const articles = registerKey('articles')
    let id = getQueryString('article_id')
    const card = articles.find( item => item.id == id )
    if(!card){
        globalMsg('article does not exists !!:(', true)
    }
    const card_el = article_card(card)
    card_el.classList.add('full-view')
    put_inside(full_article, [card_el])
}


full_article.onleave = () => {
    return { removeQueries : ['article_id'] }
}

export function go_on_article(id){
    const articles = registerKey('articles')
    setQueryString('article_id', id, true)
    setQueryString('page', 'fullarticle')

}
export default full_article