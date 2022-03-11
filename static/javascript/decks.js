// DEBUG
console.log("DEBUG : loaded decks.js");

// GLOBAL STORE
const store = new Vuex.Store({
    state:{
        delete_deck_ids:[],
    }
});

// DECK COMPONENT START
const deck = Vue.component("deck",{
    // COMPONENT PROPS
    props:["deck","current_user", "index"],

    // COMPONENT DATA
    data:function(){
        return{
            current_visibility:this.deck.visibility,
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
            <p class="visibility-label">{[ deck.visibility ]}</p>
            <div class="form-check form-switch custom-switch-form">
                <input v-if="deck.visibility=='Private'" class="form-check-input custom-switch" type="checkbox" id="flexSwitchCheckDefault" @click=privacy_toggle()>
                <input v-else-if="deck.visibility=='Public' && deck.owner != current_user.username" class="form-check-input custom-switch" type="checkbox" id="flexSwitchCheckCheckedDisabled" checked disabled>
                <input v-else class="form-check-input custom-switch custom-switch" type="checkbox" id="flexSwitchCheckChecked" checked @click=privacy_toggle()>
            </div>
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ deck.name ]}</h5>
        <p class="card-text">{[ deck.description ]}</p>
        <p>{[ deck.number_of_cards ]} cards</p>
        <p>Created by {[ deck.owner ]}</p>
        <a href="#" class="btn btn-primary card-button-1">Open deck</a>
        </div>
        <div class="card-footer text-muted">
            Last reviewed : {[ deck.last_reviewed ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{
        update_visibility:function(current_visibility,new_visibility,deck_id,user_id,auth_token){
            fetch(this.url_api_update_visibility,{method:'POST',headers:{'Content-Type':'application/json','auth-token':auth_token},
            body:JSON.stringify({'current_visibility':current_visibility,'new_visibility':new_visibility,'deck_id':deck_id,'user_id':user_id})})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    this.deck.visibility=new_visibility;
                    this.console.log(data);
                }
                else {
                    this.deck.visibility = current_visibility;
                }
            })
            .catch((error)=>{
                console.log(error);
            });   
        },

        privacy_toggle:function (){
            if (this.visibility == 'Private'){
                toggle = document.getElementsByClassName('custom-switch')
            }
            else {
                toggle = document.getElementsByClassName('custom-switch')
            }
            let auth_token = this.getCookie('auth-token');
            console.log("index : "+this.index)
            current_visibility = this.current_visibility;
            new_visibility = (toggle[this.index].checked) ? 'Public' : 'Private';
            console.log(toggle[this.index].checked)
            deck_id = this.deck_id;
            user_id = this.user_id;
            console.log(new_visibility);
            this.update_visibility(current_visibility,new_visibility,deck_id,user_id,auth_token);
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


// DECKSELECTOR COMPONENT START
const deckselector = Vue.component("deckselector",{
    // COMPONENT PROPS
    props:["deck","current_user", "index"],

    // COMPONENT DATA
    data:function(){
        return{
            current_visibility:this.deck.visibility,
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
            <div class="form-check custom-check-form">
            <input class="form-check-input custom-check" type="checkbox" :value=this.deck_id id="flexCheckDefault" @click="interacted()">
            </div>
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ deck.name ]}</h5>
        <p class="card-text">{[ deck.description ]}</p>
        <p>{[ deck.number_of_cards ]} cards</p>
        <p>Created by {[ deck.owner ]}</p>
        <a href="#" class="btn btn-primary card-button-1">Open deck</a>
        </div>
        <div class="card-footer text-muted">
            Last reviewed : {[ deck.last_reviewed ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{
        interacted:function (){
            check = document.getElementsByClassName('custom-check')[this.index];
            if (check.checked){
                console.log('checked for deck_id : '+check.value)
                store.state.delete_deck_ids.push(check.value)
            }
            else{
                console.log('unchecked for deck_id : '+check.value)
            }


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
            <router-link to="/adddeck">
                <button class="btn btn-success btn-size-1">Add Deck</button>
            </router-link>
            <router-link to="/deletedecks">
                <button class="btn btn-warning btn-size-1">Delete Deck</button>
            </router-link>
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
                    this.pupolate_decksview(auth_token)
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


// ADDDECK COMPONENT START
const adddeck = Vue.component('adddeck',{
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
            <router-link to="/">
                <button class="btn btn-info btn-size-1">View Decks</button>
            </router-link>
            <router-link to="/deletedecks">
                <button class="btn btn-warning btn-size-1">Delete Deck</button>
            </router-link>
            <br>
            <div class="adddeck-block">
              <div class="mb-3 mb-3-custom">
                <label for="deck-form-input-name" class="form-label deck-form-label">Deck name</label>
                <input v-model="deck_name" type="text" class="form-control deck-form-input" id="deck-form-input-name" placeholder="Deck name">
              </div>
              <div class="mb-3 mb-3-custom">
                <label for="deck-form-input-description" class="form-label deck-form-label">Deck description</label>
                <input v-model="deck_description" type="text" class="form-control deck-form-input" id="deck-form-input-description" placeholder="Deck description">
              </div>
              <div class="mb-3 mb-3-custom">
                <p class="visibility-label" style="margin-left: 100px;">{[ visibility ]}</p>
                <div class="form-check form-switch custom-switch-form">
                  <input class="form-check-input custom-switch" type="checkbox" id="flexSwitchCheckDefault" @click=privacy_toggle()>
              </div>
              </div>
              <a class="btn btn-primary card-button-2" style="float: right;" @click="submit()">Add</a>
              <a class="btn btn-primary card-button-2" style="float: right; margin-right: 10px;">Import</a>
            </div>  
        </div>    
    </div>
    `,

    // COMPONENT DATA
    data: function() {
        return {
        loading:false,
        current_user:{'username':undefined,'user_id':undefined},
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
        url_dashboard:'http://'+window.location.host+'/dashboard',
        url_decks:'http://'+window.location.host+'/decks',
        url_api_manage_deck:'http://'+window.location.host+'/api-manage-decks',
        deck_name:undefined,
        deck_description:undefined,
        visibility:'Private',
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
                    this.console.log(data);
                }
                else {
                    this.current_user['username'] = undefined;
                    this.current_user['user_id'] = undefined;
                    window.location.href = this.url_dashboard
                }
            })
            .catch((error)=>{
                console.log(error);
            });   
        },

        privacy_toggle:function() { 
            if (this.visibility == 'Private'){
                toggle = document.getElementsByClassName('custom-switch')
            }
            else {
                toggle = document.getElementsByClassName('custom-switch')
            }
            let auth_token = this.getCookie('auth-token');
            this.visibility = (toggle[0].checked) ? 'Public' : 'Private';
            console.log(toggle[0].checked)
            console.log(this.visibility);
        },

        submit:function(){
            let auth_token = this.getCookie('auth-token')
            fetch(this.url_api_manage_deck,{method:'POST',headers:{'Content-Type':'application/json','auth-token':auth_token},
            body:JSON.stringify({'visibility':this.visibility,'deck_name':this.deck_name,'deck_description':this.deck_description,'user_id':this.current_user['user_id']})})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    if (data['success']){
                        alert('Deck added!')
                        window.location.href = this.url_decks
                    }
                    else{
                        alert('Deck could not be added!')
                    }
                }
                else {
                    this.deck.visibility = current_visibility;
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



// DELETEDECKS COMPONENT START
const deletedecks = Vue.component('deletedecks',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
            <router-link to="/">
                <button class="btn btn-info btn-size-1">View Decks</button>
            </router-link>
            <router-link to="/adddeck">
                <button class="btn btn-success btn-size-1">Add Deck</button>
            </router-link>
            <br>
            <br>
            <button class="btn btn-danger btn-size-1" @click="submit()">Delete</button>
            <br>
            <deckselector v-for="(deck,i) in decks" :index="i" :deck="deck" :current_user="current_user"></deckselector>
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
        url_api_manage_deck:'http://'+window.location.host+'/api-manage-decks',
        url_decks:'http://'+window.location.host+'/decks',
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
                    this.pupolate_decksview(auth_token)
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
            fetch(this.url_api_populate_decksview,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token,'purpose':'restricted'},})
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

        submit:function(){
            let deck_ids = []
            let user_id = this.current_user['user_id']
            let auth_token = this.getCookie('auth-token')
            for (x of store.state.delete_deck_ids){
                deck_ids.push(x)
            }
            console.log(deck_ids)
            if (deck_ids.length != 0){
                fetch(this.url_api_manage_deck,{method:'DELETE',headers:{'Content-Type':'application/json','auth_token':auth_token},
                body:JSON.stringify({'deck_ids':deck_ids,'user_id':this.current_user['user_id']})
                })
                .then((response)=>{
                    if (!response.ok){
                        console.log("Response not ok");
                    }
                return response.json();
                })
                .then((data)=>{
                    if (data['authenticated']){
                        if (data['success']){
                            alert('Deck Deleted!')
                            window.location.href = this.url_decks
                        }
                        else{
                            alert('Deck Could not be deleted!')
                        }
                    }
                    else{
                        console.log(data)
                    }
                })
                .catch((error)=>{
                    console.log(error);
                });
                
            }
            
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

    {
        path:'/adddeck',
        component:adddeck,
    },

    {
        path:'/deletedecks',
        component:deletedecks,
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
                    this.current_user['user_id'] = data["user_id"]
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
