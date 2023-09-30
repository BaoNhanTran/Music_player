import html from '../core.js'
import { connect } from '../store.js'

function Footer({ todos, filter, filters }) {
    return html`
        <footer class="footer">
            <!-- This should be "0 items left" by default -->
            <span class="todo-count"><strong>${todos.filter(filters.active).length}</strong> item left</span>
            <!-- Remove this if you don't implement routing -->
            <ul class="filters">
                ${Object.keys(filters).map(type => `
                    <li>
                        <a
                            href="#/"
                            class="${filter === type && 'selected'}"
                            onclick="dispatch('switchFilter', '${type}')"
                        >
                            ${type[0].toUpperCase() + type.slice(1)}
                        </a>
                    </li>
                `)}
            </ul>
            <!-- Hidden if no completed items are left ↓ -->
            ${todos.some(filters.completed) ? `
            <button
                class="clear-completed"
                onclick="dispatch('clearCompleted')"
            >
                Clear completed
            </button>
            ` : `<span class="clear-completed">No completed tasks!</span>`}
        </footer>
    `
}

export default connect()(Footer)