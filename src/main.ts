import * as firebase from "firebase/app"
import firebaseConfig from "../firebaseConfig"
import './app.css'
import App from './App.svelte'

firebase.initializeApp(firebaseConfig)

const app = new App({
  target: document.getElementById('app')
})

export default app
