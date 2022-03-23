// DEBUG
console.log("DEBUG : loaded quiz.js");



// DECK COMPONENT START
const deck = Vue.component("deck",{
    // COMPONENT PROPS
    props:["deck","current_user", "index"],

    // COMPONENT DATA
    data:function(){
        return{
            deck_id:this.deck.deck_id,
            user_id:this.current_user.user_id,
            url_api_update_visibility:'http://'+window.location.host+'/api-update-deck-visibility',
        }
    },
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center card-custom">
        <div class="card-header">
        <br>
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ deck.name ]}</h5>
        <p class="card-text">{[ deck.description ]}</p>
        <p>{[ deck.number_of_cards ]} cards</p>
        <p>Created by {[ deck.owner ]}</p>
        <button class="btn btn-primary card-button-1" @click="startquiz()">Start quiz</button>
        </div>
        <div class="card-footer text-muted">
            Last reviewed : {[ deck.last_reviewed ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{

        startquiz:function(){
            store.state.current_deck_being_viewed = this.deck_id,
            window.location.href = 'http://'+window.location.host + '/quiz#/active';
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
    }
})


// DECKSVIEW COMPONENT START
const decksview = Vue.component('decksview',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
            <br>
            <deck v-for="(deck,i) in decks" :index="i" :deck="deck" :current_user="current_user"></deck>
        </div>    
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        loading:true,
        current_user:{'username':undefined,'user_id':undefined},
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
        url_dashboard:'http://'+window.location.host+'/dashboard',
        url_api_populate_decksview:'http://'+window.location.host+'/api-load-all-decks',
        decks:[],
       }

    },

    // COMPONENT METHODS
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
                    this.current_user['username'] = data["username"];
                    this.current_user['user_id'] = data["user_id"]
                    this.pupolate_decksview(auth_token);
                    this.console.log(data);
                }
                else {
                    this.current_user['username'] = undefined;
                    this.current_user['user_id'] = undefined;
                    window.location.href = 'http://'+window.location.host + '/';
                }
            })
            .catch((error)=>{
                console.log(error);
            });   
        },

        pupolate_decksview:function(auth_token){
            fetch(this.url_api_populate_decksview,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token,'purpose':'all'},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                console.log(this.decks);
                this.decks = data["decks"];
                this.loading=false;
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
        userloaded:false,
        current_user:{'username':undefined,'uder_id':undefined},
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
    },
    methods:{
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
                    this.current_user['username'] = data["username"];
                    this.current_user['user_id'] = data["user_id"];
                    this.userloaded=true;
                    this.console.log(data);
                }
                else {
                    this.current_user['username'] = undefined;
                    this.current_user['user_id'] = undefined;
                    window.location.href = 'http://'+window.location.host + '/';
                }
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

    created:function(){
        let auth_token = this.getCookie('auth-token')
        if (auth_token != null){
            console.log('auth-token : '+auth_token)
            this.load_user(auth_token)
        }
        else{
            window.location.href = 'http://'+window.location.host + '/logout';
        }
    },
})
