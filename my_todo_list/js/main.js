import { attach } from '../store.js'
import App from '../component/App.js'

attach(App, document.getElementById('root'))

// const state = {
//     todos: [
//         {
//             title: 'abc',
//             completed: false,
//         },
//         {
//             title: '123',
//             completed: false,
//         },
//         {
//             title: '456',
//             completed: true,
//         },
//     ]
// }

// const title = ['nhan']

// state.todos.push({ title, completed: false })

// console.log(state);