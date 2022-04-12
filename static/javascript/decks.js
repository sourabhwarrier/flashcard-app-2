// DEBUG
console.log("DEBUG : loaded decks.js");

// GLOBAL STORE
const store = new Vuex.Store({
    state:{
        old_deck_name:null,
        old_deck_description:null,
        old_deck_visibility:null,
        delete_deck_ids:[],
        delete_card_ids:[],
        current_deck_being_viewed:null,
        current_deck_being_deleted_from:null,
        current_deck_being_edited:null,
        current_deck_being_added_to:null,
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
        <button class="btn btn-primary card-button-1" @click="opendeck()">Open deck</button>
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

        opendeck:function(){
            store.state.current_deck_being_viewed = this.deck_id,
            window.location.href = 'http://'+window.location.host + '/decks#/cards';
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
                this.$emit('testfunc');
            }
            else{
                console.log(store.state.delete_deck_ids)
                console.log(check.value)
                if (store.state.delete_deck_ids.includes(check.value)){
                    let temp = []
                    for (x of store.state.delete_deck_ids){
                        if (x != check.value){
                            temp.push(x);
                        }
                    }
                    store.state.delete_deck_ids = temp;
                    console.log('unchecked and removed deck_id : '+check.value)
                } 
                //console.log('unchecked for deck_id : '+check.value)
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


// CARD COMPONENT START
const card = Vue.component("card",{
    // COMPONENT PROPS
    props:["card","current_user", "index"],

    // COMPONENT DATA
    data:function(){
        return{
            //current_visibility:this.deck.visibility,
            show:false,
            btn_text:'Show',
            deck_id:this.card.deck_id,
            user_id:this.current_user.user_id,
        }
    },
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center card-custom">
        <div class="card-header">
            {[ index+1 ]}
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ card.question ]}</h5>
        <em class="card-text">({[ card.hint ]})</em>
        <br>
        <br>
        <p v-if="show" class="card-text">{[ card.answer ]}</p>
        <button class="btn btn-primary card-button-1" @click="show_ans()">{[ btn_text ]}</button>
        </div>
        <div class="card-footer text-muted">
            From {[ card.deck_name ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{

        show_ans:function(){
            this.show = !this.show;
            this.btn_text = this.show ? "Hide" : "Show";
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



// CARDSELECTOR COMPONENT START
const cardselector = Vue.component("cardselector",{
    // COMPONENT PROPS
    props:["card","current_user", "index"],

    // COMPONENT DATA
    data:function(){
        return{
            card_id:this.card.card_id,
            user_id:this.current_user.user_id,
        }
    },
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center card-custom">
        <div class="card-header">
            <div class="form-check custom-check-form">
            <input class="form-check-input custom-check" type="checkbox" :value=this.card_id id="flexCheckDefault" @click="interacted()">
            </div>
        </div>
        <div class="card-body">
        <h5 class="card-title">{[ card.question ]}</h5>
        <p class="card-text">{[ card.hint ]}</p>
        <p>{[ card.answer ]} cards</p>
        </div>
        <div class="card-footer text-muted">
            From : {[ card.deck_name ]}
        </div>
    </div>
    `,

    //COMPONENT METHODS
    methods:{
        interacted:function (){
            check = document.getElementsByClassName('custom-check')[this.index];
            if (check.checked){
                console.log('checked for card_id : '+check.value)
                store.state.delete_card_ids.push(check.value)
                this.$emit('testfunc');
            }
            else{
                console.log(store.state.delete_deck_ids)
                console.log(check.value)
                if (store.state.delete_deck_ids.includes(check.value)){
                    let temp = []
                    for (x of store.state.delete_card_ids){
                        if (x != check.value){
                            temp.push(x);
                        }
                    }
                    store.state.delete_card_ids = temp;
                    console.log('unchecked and removed card_id : '+check.value)
                } 
                //console.log('unchecked for deck_id : '+check.value)
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
              <!--<a class="btn btn-primary card-button-2" style="float: right; margin-right: 10px;">Import</a>-->
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
        url_api_manage_decks:'http://'+window.location.host+'/api-manage-decks',
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
            fetch(this.url_api_manage_decks,{method:'POST',headers:{'Content-Type':'application/json','auth-token':auth_token},
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



// EDITDECK COMPONENT START
const editdeck = Vue.component('editdeck',{
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
                <input v-if="visibility=='Public'" class="form-check-input custom-switch" type="checkbox" id="flexSwitchCheckDefault" checked @click=privacy_toggle()>
                <input v-else class="form-check-input custom-switch" type="checkbox" id="flexSwitchCheckDefault" @click=privacy_toggle()>
                </div>
              </div>
              <p>{[ statechange ]}</p>
              <button v-if="statechange" class="btn btn-primary card-button-2" style="float: right;" @click="submit()">Edit</button>
              <button v-else class="btn btn-primary card-button-2" disabled style="float: right;" @click="submit()">Edit</button>
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
        url_api_manage_decks:'http://'+window.location.host+'/api-manage-decks',
        deck_id:undefined,
        deck_name:undefined,
        deck_description:undefined,
        visibility:undefined,
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
            fetch(this.url_api_manage_decks,{method:'PUT',headers:{'Content-Type':'application/json','auth-token':auth_token},
            body:JSON.stringify({'deck_id':this.deck_id,'visibility':this.visibility,'deck_name':this.deck_name,'deck_description':this.deck_description,'user_id':this.current_user['user_id']})})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    if (data['success']){
                        alert('Changes saved!')
                        window.location.href = this.url_decks
                    }
                    else{
                        alert('Changes could not be saved!')
                    }
                }
                else {
                    //this.deck.visibility = current_visibility;
                    alert('You are not allowed to do this!')
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

    computed:{

        statechange:function(){
        flag=false;
        if (store.state.old_deck_name != this.deck_name) {
            flag = true
        }
        if (store.state.old_deck_description != this.deck_description) {
            flag = true
        }
        if (store.state.old_deck_visibility != this.visibility) {
            flag = true
        }

        return flag;
    },
    },

    // MOUNTED
    mounted:function(){
        if (store.state.current_deck_being_edited && store.state.old_deck_name && store.state.old_deck_description && store.state.old_deck_visibility){
            this.deck_id = store.state.current_deck_being_edited
            this.deck_name=store.state.old_deck_name
            this.deck_description=store.state.old_deck_description
            this.visibility=store.state.old_deck_visibility
        }
        else{
            window.location.href = 'http://'+window.location.host + '/decks';
        }
        let auth_token = this.getCookie('auth-token')
        if (auth_token != null){
            console.log('auth-token : '+auth_token)
            this.load_user(auth_token)
        }
        else{
            window.location.href = 'http://'+window.location.host + '/logout';
        }

        
    },

    destroyed:function(){
        store.state.current_deck_being_edited = null;
        store.state.old_deck_name = null;
        store.state.old_deck_description = null;
        store.state.old_deck_visibility = null;
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
        url_api_manage_decks:'http://'+window.location.host+'/api-manage-decks',
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
                fetch(this.url_api_manage_decks,{method:'DELETE',headers:{'Content-Type':'application/json','auth_token':auth_token},
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
        store.state.delete_deck_ids = [];
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


// CARDSVIEW COMPONENT START
const cardsview = Vue.component('cardsview',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
        <h3>{[ deck_name ]}</h3>
        <p>{[ deck_description ]}</p>
            <div v-if="editable">
                <router-link to="/addcard">
                    <button class="btn btn-success btn-size-1" @click="set_deck_add()">Add Card</button>
                </router-link>
                <router-link to="/deletecards">
                    <button class="btn btn-warning btn-size-1" @click="set_deck_delete()">Delete Card</button>
                </router-link>
                <router-link to="/editdeck">
                    <button class="btn btn-primary btn-size-1" @click="set_deck_edit()">Edit Deck</button>
                </router-link>
                <button class="btn btn-primary btn-size-1 card-button-3" @click="export_deck()">Export Deck</button>
                <br>
            </div>
            <div v-else>
            <button class="btn btn-primary btn-size-1 card-button-3" @click="export_deck()">Export Deck</button>
            <br>
            </div>
            <div v-if="cards.length==0">
            <br>
            <br>
            <p>This deck is empty</p>
            </div>
            
            <card v-for="(card,i) in cards" :index="i" :card="card" :current_user="current_user"></card>
        </div>    
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
        deck_id:undefined,
        deck_name:undefined,
        editable:undefined,
        visibility:undefined,
        loading:true,
        current_user:{'username':undefined,'user_id':undefined},
        url_api_whoami:'http://'+window.location.host+'/api-whoami',
        url_dashboard:'http://'+window.location.host+'/dashboard',
        url_api_populate_cardsview:'http://'+window.location.host+'/api-manage-cards',
        url_api_export_deck:'http://'+window.location.host+'/api-export-deck',
        cards:[],
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
                    this.pupolate_cardsview(auth_token,this.deck_id)
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

        pupolate_cardsview:function(auth_token,deck_id){
            fetch(this.url_api_populate_cardsview,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token,'deck_id':deck_id},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                if (data["authenticated"]){
                    console.log(this.cards)
                this.cards = data["cards"]
                this.deck_name=data['deck_name']
                this.deck_description=data['deck_description']
                this.visibility=data['visibility']
                this.editable=data['editable']
                this.loading=false
                }
                else{
                    alert("This resource is now private");
                    window.location.href = 'http://'+window.location.host + '/dashboard';
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        export_deck:function(){
            let auth_token = this.getCookie('auth-token')
            fetch(this.url_api_export_deck,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token,'deck_id':this.deck_id},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                console.log(data)
                if (data["success"]){
                    let link = 'http://'+window.location.host + '/proc-content/'+data["endpoint"];
                    window.open(link,'_blank')
                    
                }
                else{
                    alert("Something went wrong")
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        set_deck_delete:function(){
            store.state.current_deck_being_deleted_from = this.deck_id;
        },

        set_deck_add:function(){
            store.state.current_deck_being_added_to = this.deck_id;
        },

        set_deck_edit:function(){
            store.state.current_deck_being_edited = this.deck_id;
            store.state.old_deck_name = this.deck_name;
            store.state.old_deck_description = this.deck_description;
            store.state.old_deck_visibility = this.visibility;
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
        console.log(sessionStorage.getItem('current_deck_being_viewed'));
        if (store.state.current_deck_being_viewed){
            this.deck_id = store.state.current_deck_being_viewed
        }
        else if (sessionStorage.getItem('current_deck_being_viewed')){
            store.state.current_deck_being_viewed = sessionStorage.getItem('current_deck_being_viewed')
            this.deck_id = store.state.current_deck_being_viewed
            sessionStorage.clear()
        }
        else{
            window.location.href = 'http://'+window.location.host + '/decks';
        }
        let auth_token = this.getCookie('auth-token')
        if (auth_token != null){
            console.log('auth-token : '+auth_token)
            this.load_user(auth_token)
        }
        else{
            window.location.href = 'http://'+window.location.host + '/logout';
        }
    
    },

    //DESTROYED
    destroyed: function()  {
        
      }
})


// ADDCARD COMPONENT START
const addcard = Vue.component('addcard',{
    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
            <router-link to="/cards">
                <button class="btn btn-info btn-size-1">View Cards</button>
            </router-link>
            <router-link to="/deletecards">
                <button class="btn btn-warning btn-size-1" @click="set_deck_delete()">Delete Card</button>
            </router-link>
            <br>
            <div class="adddeck-block">
              <div class="mb-3 mb-3-custom">
                <label for="deck-form-input-name" class="form-label deck-form-label">Question</label>
                <input v-model="question" type="text" class="form-control deck-form-input" id="deck-form-input-name" placeholder="Question">
              </div>
              <div class="mb-3 mb-3-custom">
                <label for="deck-form-input-description" class="form-label deck-form-label">Hint</label>
                <input v-model="hint" type="text" class="form-control deck-form-input" id="deck-form-input-description" placeholder="Hint">
              </div>
              <div class="mb-3 mb-3-custom">
                <label for="deck-form-input-description" class="form-label deck-form-label">Answer</label>
                <input v-model="answer" type="text" class="form-control deck-form-input" id="deck-form-input-description" placeholder="Answer">
              </div>
              <a class="btn btn-primary card-button-2" style="float: right;" @click="submit()">Add</a>
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
        url_cards:'http://'+window.location.host+'/decks#/cards',
        url_api_manage_cards:'http://'+window.location.host+'/api-manage-cards',
        deck_id:store.state.current_deck_being_added_to,
        question:undefined,
        hint:undefined,
        answer:undefined,
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

        submit:function(){
            let auth_token = this.getCookie('auth-token')
            fetch(this.url_api_manage_cards,{method:'POST',headers:{'Content-Type':'application/json','auth-token':auth_token,'user_id':this.current_user['user_id']},
            body:JSON.stringify({'deck_id':this.deck_id,'question':this.question,'hint':this.hint,'answer':this.answer})})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
                })
            .then((data)=>{
                if (data["authenticated"]) {
                    if (data['success']){
                        alert('Card added!')
                        window.location.href = this.url_cards
                    }
                    else{
                        alert('Card could not be added!')
                    }
                }
                
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        set_deck_delete:function(){
            store.state.current_deck_being_deleted_from = this.deck_id;
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
        if (store.state.current_deck_being_added_to){
            this.deck_id = store.state.current_deck_being_added_to
        }
        else{
            window.location.href = 'http://'+window.location.host + '/decks';
        }

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


// DELETECARDS COMPONENT START
const deletecards = Vue.component('deletecards',{

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="decks-view">
        <div v-if="loading">
        <img stryle="" src="static/img/loader3.gif" alt="loading" width="50" height="50">
        </div>
        <div v-else>
        <h3>{[ deck_name ]}</h3>
        <p>{[ deck_description ]}</p>
            <router-link to="/cards">
                <button class="btn btn-info btn-size-1">View Cards</button>
            </router-link>
            <router-link to="/addcard">
                <button class="btn btn-success btn-size-1" @click="set_deck_add()">Add Card</button>
            </router-link>
            <br>
            <br>
            <button class="btn btn-danger btn-size-1" @click="submit()">Delete</button>
            <br>
            <cardselector v-for="(card,i) in cards" :index="i" :card="card" :current_user="current_user"></cardselector>
        </div>    
    </div>
    `,
    
    // COMPONENT DATA
    data: function() {
        return {
            loading:true,
            deck_name:undefined,
            editable:undefined,
            visibility:undefined,
            current_user:{'username':undefined,'user_id':undefined},
            url_api_whoami:'http://'+window.location.host+'/api-whoami',
            url_dashboard:'http://'+window.location.host+'/dashboard',
            url_cards:'http://'+window.location.host+'/decks#/cards',
            url_api_populate_cardsview:'http://'+window.location.host+'/api-manage-cards',
            cards:[],
            url_api_manage_cards:'http://'+window.location.host+'/api-manage-cards',
            deck_id:store.state.current_deck_being_deleted_from,
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
                    this.pupolate_cardsview(auth_token)
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

        pupolate_cardsview:function(auth_token){
            fetch(this.url_api_populate_cardsview,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth_token':auth_token,'deck_id':this.deck_id},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                console.log(this.cards)
                this.cards = data["cards"]
                this.deck_name=data['deck_name']
                this.deck_description=data['deck_description']
                this.visibility=data['visibility']
                this.editable=data['editable']
                this.loading=false
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        submit:function(){
            let card_ids = []
            let user_id = this.current_user['user_id']
            let auth_token = this.getCookie('auth-token')
            for (x of store.state.delete_card_ids){
                card_ids.push(x)
            }
            console.log(card_ids)
            if (card_ids.length != 0){
                fetch(this.url_api_manage_cards,{method:'DELETE',headers:{'Content-Type':'application/json','auth_token':auth_token},
                body:JSON.stringify({'card_ids':card_ids,'user_id':this.current_user['user_id']})
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
                            alert('Card Deleted!')
                            window.location.href = this.url_cards
                        }
                        else{
                            alert('Card Could not be deleted!')
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

        set_deck_add:function(){
            store.state.current_deck_being_added_to = this.deck_id;
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
        store.state.delete_card_ids = [];
        if (store.state.current_deck_being_deleted_from){
            this.deck_id = store.state.current_deck_being_deleted_from
        }
        else{
            window.location.href = 'http://'+window.location.host + '/decks';
        }
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



const notfound = Vue.component('notfound',{
     // COMPONENT DELIMITER
     delimiters:["{[","]}"],
    
     // COMPONENT TEMPLATE
     template:`
     <div>
         <h1>404</h1>
     </div>
     `,
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

    {
        path:'/editdeck',
        component:editdeck,
    },

    {
        path:'/cards',
        component:cardsview,
    },

    {
        path:'/addcard',
        component:addcard,
    },

    {
        path:'/deletecards',
        component:deletecards,
    },

    {
        path:'/*',
        component:notfound,
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
                    this.current_user['user_id'] = data["user_id"]
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
