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
        <p class="card-text">Average Score : {[ deck.average_score ]}</p>
        <p class="card-text">Times reviewed : {[ deck.times_reviewed ]}</p>
        <a href="#" class="btn btn-primary card-button-1">Open deck</a>
    </div>
    <div class="card-footer text-muted">
        Last reviewed : {[ deck.last_reviewed ]}
    </div>
  </div>
    `,
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
            current_user_name:undefined,
            current_user_id:undefined,
            url_api_whoami:'http://'+window.location.host+'/api-whoami',
            url_dashboard:'http://'+window.location.host+'/dashboard',
            url_api_populate_dashboard:'http://'+window.location.host+'/api-populate-dashboard',
            deck_stats:[],
        }
    },  

    // APP METHODS
    methods :{
        load_user:function (){
            fetch(this.url_api_whoami,{method:'GET',headers:{'Content-Type':'application/json'},})
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
                    this.pupolate_dashboard()
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
            console.log(this.current_user_name)   
        },

        pupolate_dashboard:function(){
            fetch(this.url_api_populate_dashboard,{method:'GET',headers:{'Content-Type':'application/json','user_id':this.current_user_id},})
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
    }, 
    // APP.CREATED
    created:function(){
        this.load_user();
    },


})


