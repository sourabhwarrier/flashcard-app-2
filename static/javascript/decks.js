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
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
            <router-link to="/adddeck">
                <button class="btn btn-success">Add Deck</button>
            </router-link>
            <router-link to="/deletedeck">
                <button class="btn btn-warning">Delete Deck</button>
            </router-link>
            <br>
            <deck v-for="deck in decks" :deck="deck"></deck>
        </div>    
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:true,
        current_user_name:undefined,
        current_user_id:undefined,
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
        url_dashboard:'http://'+window.location.host+'/dashboard',
        url_api_populate_decksview:'http://'+window.location.host+'/api-load-all-decks',
        decks:[],
       }

    },

    // DECKSVIEW METHODS
    methods :{
        load_user:function (auth_token){
            fetch(this.url_api_whoami,{method:'GET',headers:{'Content-Type':'application/json','auth-token':auth_token},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    this.current_user_name = data["username"];
                    this.current_user_id = data["user_id"]
                    this.pupolate_decksview(auth_token)
                    this.console.log(data);
                }
                else {
                    this.current_user_name = undefined;
                    this.current_user_id = undefined;
                    window.location.href = 'http://'+window.location.host + '/';
                }
            })
            .catch((error)=>{
                console.log(error);
            });   
        },

        pupolate_decksview:function(auth_token){
            fetch(this.url_api_populate_decksview,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user_id,'auth_token':auth_token},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                console.log(this.decks)
                this.decks = data["decks"]
                this.loading=false
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        getCookie:function(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return null;
          },
    }, 

    // MOUNTED
    mounted:function(){
        let auth_token = this.getCookie('auth-token')
        if (auth_token != null){
            console.log('auth-token : '+auth_token)
            this.load_user(auth_token)
        }
        else{
            window.location.href = 'http://'+window.location.host + '/logout';
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
