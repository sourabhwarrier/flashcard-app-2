// DEBUG
console.log("DEBUG : loaded dashboard.js");


// DECKSTAT COMPONENT START
const deck = Vue.component("deck-stat",{
    // COMPONENT PROPS
    props:["deck"],

    // COMPONENT DELIMITER
    delimiters:["{[","]}"],
    
    // COMPONENT TEMPLATE
    template:`
    <div class="card text-center card-custom">
    <div class="card-header">
        {[ deck.visibility ]}
    </div>
    <div class="card-body">
        <h5 class="card-title">{[ deck.name ]}</h5>
        <p class="card-text">{[ deck.description ]}</p>
        <p class="card-text">Average Score : {[ deck.average_score ]}%</p>
        <p class="card-text">Rating : {[ deck.rating ]}</p>
        <p class="card-text">Times reviewed : {[ deck.times_reviewed ]}</p>
        <a href="#" class="btn btn-primary card-button-1" @click="opendeck()">Open deck</a>
    </div>
    <div class="card-footer text-muted">
        Last reviewed : {[ deck.last_reviewed ]}
    </div>
  </div>
    `,

    methods:{
        opendeck:function(){
            sessionStorage.setItem('current_deck_being_viewed', this.deck.deck_id);
            window.location.href = 'http://'+window.location.host + '/decks#/cards';
        },

        setCookie: function(cname, cvalue, exhours) {
            const d = new Date();
            d.setTime(d.getTime() + (exhours*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
          }
    }
})











// APP
const app = new Vue({
    // APP DELIMITER
    delimiters:["{[","]}"],
    el:'#app',
    
    // APP DATA
    data: function(){
        return {
            loading:true,
            current_user:{'username':undefined,'user_id':undefined},
            url_api_whoami:'http://'+window.location.host+'/api-whoami',
            url_dashboard:'http://'+window.location.host+'/dashboard',
            url_api_populate_dashboard:'http://'+window.location.host+'/api-populate-dashboard',
            deck_stats:[],
        }
    },  

    // APP METHODS
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
                    this.pupolate_dashboard(auth_token)
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

        pupolate_dashboard:function(auth_token){
            fetch(this.url_api_populate_dashboard,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user['user_id'],'auth-token':auth_token},})
            .then((response)=>{
                if (!response.ok){
                    console.log("Response not ok");
                }
            return response.json();
            })
            .then((data)=>{
                this.deck_stats = data["deck_stats"]
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
    // APP.CREATED
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


