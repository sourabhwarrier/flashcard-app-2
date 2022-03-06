// DEBUG
console.log("DEBUG : loaded decks.js");

// DECKSTAT COMPONENT START
const deck = Vue.component("deck",{
    // COMPONENT PROPS
    props:["deck"],

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center card-custom">
        <div class="card-header">
            <p class="visibility-label">{[ deck.visibility ]}</p>
            <div class="form-check form-switch custom-switch-form">
                <input v-if="deck.visibility=='Private'" class="form-check-input custom-switch" type="checkbox" id="flexSwitchCheckDefault" @click=privacy_toggle()>
                <input v-else class="form-check-input custom-switch custom-switch" type="checkbox" id="flexSwitchCheckChecked" checked @click=privacy_toggle()>
            </div>
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ deck.name ]}</h5>
        <p class="card-text">{[ deck.description ]}</p>
        <p>{[ deck.number_of_cards ]} cards</p>
        <a href="#" class="btn btn-primary card-button-1">Open deck</a>
        </div>
        <div class="card-footer text-muted">
            Last reviewed : {[ deck.last_reviewed ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{
        privacy_toggle:()=>{
            if (this.visibility == 'Private'){
                toggle = document.getElementsByClassName('custom-switch')
            }
            else {
                toggle = document.getElementsByClassName('custom-switch')
            }
            new_visibility = toggle[0].checked
            console.log(new_visibility)
        }
    }
})


// DECKSVIEW COMPONENT START
const decksview = Vue.component('decksview',{
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decksview">
        <router-link to="/adddeck">
            <button class="btn btn-success">Add Deck</button>
        </router-link>
        <router-link to="/deletedeck">
            <button class="btn btn-warning">Delete Deck</button>
        </router-link>
        <br>
        <deck v-for="deck in decks" :deck="deck"></deck>
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:false,
        decks:[{'owner': 'user1', 'visibility': 'Private', 'name': 'deck02', 'description': 'this is the first deck', 'average_score': '60', 'times_reviewed': '4', 'last_reviewed': 'Today'}]
        }

    }
})






// ROUTES
const routes = [
    {
        path:'/',
        component:decksview,
    },
]

// ROUTER
const router = new VueRouter({
    routes:routes,
})


const app = new Vue({
    delimiters:["{[","]}"],
    el:'#app',
    router:router,
    data:{
        message:"loaded by vue"
    }
})
