import html from '../core.js'
import { connect } from '../store.js'
import Detail from './Detail.js'

function TodoItem({ todo, index, editIndex, showIndex }) {
    return html`
        <li
            class="${todo.completed && "completed"} 
            ${editIndex === index && "editing"}"
        >
            <div class="view">
                <input
                    class="toggle"
                    type="checkbox"
                    ${todo.completed && "checked"}
                    onchange="dispatch('toggle', ${index})"
                >
                <label
                    class="todo-label"
                    ${!todo.completed && `ondblclick="dispatch('startEdit', ${index})"`}
                >
                    <span class="todo-text">${todo.title}</span>
                    <span class="date">${todo.date}</span>
                </label>
                <button
                    class="destroy"
                    onclick="dispatch('destroy', ${index})"
                >
                </button>
            </div>
            ${todo.title.length <= 43 ? 
                `
                    <input
                    onkeyup="event.keyCode === 13 && dispatch('endEdit', this.value.trim()) || event.keyCode === 27 && dispatch('cancelEdit')"
                    onblur="dispatch('endEdit', this.value.trim())"
                    class="edit"
                    value="${todo.title}">
                ` : 
                `
                    <textarea
                        rows="3" cols="50"
                        class="edit"
                        onblur="dispatch('endEdit', this.value.trim())"
                        onkeyup="event.keyCode === 13 && dispatch('endEdit', this.value.trim()) || event.keyCode === 27 && dispatch('cancelEdit')"
                        onclick="console.log(this.value.length)"
                    >${todo.title}</textarea>
                `
            }
        </li>
    `
}

export default connect()(TodoItem)