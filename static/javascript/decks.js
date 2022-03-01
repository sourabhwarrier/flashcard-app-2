// START COMPONENT START
const start = Vue.component("deck",{
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
        <a href="#" class="btn btn-primary card-button-1">Open deck</a>
    </div>
    <div class="card-footer text-muted">
        Last reviewed : {[ deck.last_reviewed ]}
    </div>
  </div>
    `,
})




// DECKSVIEW COMPONENT START
const decksview = Vue.component('decksview',{
    
    // COMPONENT PROPS
    props:["decks"],

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
        <a href="#" class="btn btn-primary card-button-1">Open deck</a>
    </div>
    <div class="card-footer text-muted">
        Last reviewed : {[ deck.last_reviewed ]}
    </div>
  </div>
    `,
})
