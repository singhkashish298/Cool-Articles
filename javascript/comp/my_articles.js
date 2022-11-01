import { el, put_inside, setQueryString } from "../tools/helper.js";
import { getLocalStorageData, registerKey } from "../tools/l_storage.js";
import article, { article_card, private_article_card } from "./article.js";

const my_article = el(null, 'div', {className : 'my__article',})
const new_article_btn = el(null, 'div', {className: 'new__articleBtn', innerHTML :'+'})
const my_cards = el(null, 'div', { className : 'my__cards'})
put_inside(my_article, [
    new_article_btn,
    el(null, 'div',{innerHTML : 'My Articles --> ', className : 'my__articleTitle'}),
    my_cards,
])

my_article.onfire = page => {
    const all_articles = registerKey('articles')
    const session = getLocalStorageData('session')
    const my = all_articles.filter((item )=> session.username == item.author )
    const card_els = my.map((item) => {
        return private_article_card(item)
    })
    
    my_cards.innerHTML = ''
    put_inside(my_cards, card_els.reverse() )
    // console.log(card_els)
}

// adding event listener on new_article_btn
new_article_btn.addEventListener('click', e=> setQueryString('page', 'create-article'))

export default my_article