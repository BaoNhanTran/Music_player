import html from '../core.js'
import { connect } from '../store.js'

function Detail(todo) {
    console.log(todo);
    return html`
        <div class="modal">
            <div class="detail">
                ${todo.title}
            </div>
        </div>
    `
}

export default Detail