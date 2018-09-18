$(function(){

	// Create a model for the items
	var Item = Backbone.Model.extend({
		// Will contain three attributes.
		// These are their default values
		defaults:{
			title: '',
			author: '',
			link: '',
			type: '',
			all: '',
			auth_drp: 'Mary'
		},
		
	});

	// Create a model for text
	var Text = Backbone.Model.extend({
		// Will contain three attributes.
		// These are their default values
		defaults:{
			text: '',
			typeText: ''
		}
		
	});

		// Create a model for text
	var Drp = Backbone.Model.extend({
		// Will contain three attributes.
		// These are their default values
		defaults:{
			author: '',
			dropType: '', 
			all: 'All'
		}
		
	});

	// Create a model for check
	var Check = Backbone.Model.extend({
		// Will contain three attributes.
		// These are their default values
		defaults:{
			name: '',
			checked: '',
			typeCheck: ''
		}
		
	});

	// Create a collection of items
	var itemList = Backbone.Collection.extend({
		// Will hold objects of the item model
		model: Item,

		//alphabetical based on type
		comparator: 'type'
		
	});

	// Create a collection of text descriptions
	var textList = Backbone.Collection.extend({
		// Will hold objects of the item model
		model: Text
		
	});

		// Create a collection of text descriptions
	var drpList = Backbone.Collection.extend({
		// Will hold objects of the item model
		model: Drp
		
	});

	// Create a collection of check descriptions
	var checkList = Backbone.Collection.extend({
		// Will hold objects of the item model
		model: Check
		
	});

	//create collection
	items = new itemList();

	//url of the json file
	items.url = "data-test.json";

	//fetch the items in the json file, print success or failure notifications
	items.fetch({
		url: "data-test.json",
		success: function() {
          	console.log("JSON file load was successful", items);

          	this.list = $('#items');

  	    	var sortedWorks = items.groupBy(function(work) {
		 		return work.get("all");
			});

	    	//add to works_collection from work_type
			 _.each(sortedWorks, function(work) {
				works_collection.add(work);
			});
			
			//empty the list
			this.list.empty();

	    	//the list of items- rendering based on the choice of the user
			works_collection.each(function(item){

				var view = new itemView({ model: item });
				this.list.append(view.render().el);
				
			}, this);
      	},
    	error: function(){
       		console.log('There was some error in loading and processing the JSON file');
    	},

	});

	 //create collection of texts
	 var texts = new textList();

	 texts.add({text: 'Browse complete collection.', type: 'All'});
	 texts.add({text: 'Browse the archive by title (manuscript pages may be re-organized in the linear order of the work).', type: 'Work'});
	 texts.add({text: 'Browse the archive by manuscript shelfmark, with pages in their physical order.', type: 'Manuscript'});

	 //create collection of drop down elements (one for each author)
	 var drops = new drpList();

	 drops.add({author: 'Author', dropType: 'All'});
	 drops.add({author: 'Mary Shelley', dropType: 'Mary'});
	 drops.add({author: 'P. B. Shelley', dropType: 'PB'});
	 drops.add({author: 'William Godwin', dropType: 'Will'});

	//create collection of checks
	 var checks = new checkList();

	 checks.add({name: 'All', checked: 'true', typeCheck: 'All'});
	 checks.add({name: 'Work', checked: 'false', typeCheck: 'Work'});
	 checks.add({name: 'Manuscript', checked: 'false', typeCheck: 'Manuscript'});

	 //New collection to hold all works with specific type
	 var works_collection = new itemList();     
	
	 //New collection to hold all text with specific type 
	 var texts_collection = new textList();
	 
	 texts_collection.add({text: 'Browse complete collection.', type: 'All'});

	// This view turns the Item model into HTML 
	var itemView = Backbone.View.extend({
		tagName: 'li',
			
		//reference items template
		template1: _.template( $("#mainElement").html() ),
    	
		//initialize model listen for changes
		initialize: function(){

			this.listenTo(this.model, 'change', this.render);

		},

		//render model view
		render: function(){
			//render the template
			var template1 = this.template1(this.model.toJSON());
    		this.$el.html(template1);

			return this;
		},
    
	});

	// This view turns the Text model into HTML 
	var textView = Backbone.View.extend({
		tagName: 'p',
		
		//reference text template
		template2: _.template( $("#textElement").html() ),

		//initialize model listen for changes
		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			
		},

		//render model view
		render: function(){
			
			//render the template
			var template2 = this.template2(this.model.toJSON());
    		this.$el.html(template2);

			return this;
		}
    
	});

		// This view turns the Text model into HTML 
	var drpView = Backbone.View.extend({
		tagName: 'option',
		
		//reference text template
		template3: _.template( $("#drpElement").html() ),

		//initialize model listen for changes
		initialize: function(){
			this.list = $('#items');

			this.listenTo(this.model, 'change', this.render);
			
		},

		// //click event to get the value of which checkbox is clicked- re render list
		events: {
        	'change ': 'changed'
    	},

    	changed: function(){
    		//call sort drop to sort the works
    		this.sort_drop();
    	},

		//render model view
		render: function(){
			
			//render the template
			var template3 = this.template3(this.model.toJSON());
    		this.$el.html(template3);

			return this;
		},


       sort_drop: function(){ //fix lol
       		
       	    

        	console.log(works_collection);
        	
			//from the specific check box sort type determine if all or or specific type needs to be added
       		if(this.$(':checked').val() == 'Author'){
        		//sorted works is all the works broken up into two arrays for 'Work' and 'Manuscript'
				var sortedWorks = works_collection.groupBy(function(work) {
				 	return work.get("all");
				});

				//add to works_collection from work_type
				 _.each(sortedWorks, function(work) {
					works_collection.add(work);
				});

				//empty the list
				this.list.empty();

	        	//the list of items- rendering based on the choice of the user
				works_collection.each(function(item){
					
					var view = new itemView({ model: item });
					this.list.append(view.render().el);
					

				}, this);
				

        	}else{
        		
        		//sorted works is all the works broken up into two arrays for 'Work' and 'Manuscript'
				var sortedWorks = works_collection.groupBy(function(work) {
				 	return work.get("author");
				});

				//work_type is all sorted works with type 'Work'
				var work_type = _.first(_.values(_.pick(sortedWorks, this.$(':checked').val())));

			
				//add to works_collection from work_type
				 _.each(work_type, function(work) {
					works_collection.add(work);
				});

				//empty the list
				this.list.empty();

	        	//the list of items- rendering based on the choice of the user
				works_collection.each(function(item){
					if(item.get("author") == this.$(':checked').val()){
						var view = new itemView({ model: item });
						this.list.append(view.render().el);
					}

				}, this);

        	}
       }
    
	});

	// This view turns the checkboxes into HTML 
	var checkView = Backbone.View.extend({
		//render
		initialize: function(){
			//initialize list and txt
			this.list = $('#items');
			this.txt = $('#texts');
			
			this.listenTo(this.model, 'change', this.render);

			this.render();
			
		},

		template: _.template($("#checkElement").html()),

		//click event to get the value of which checkbox is clicked- re render list
		events: {
        	'click ': 'clicked',
    	},

		//render model view
		render: function(){
    		this.$el.append(this.template({}));

		},

		//sets $target and selected to the value checked
    	clicked: function() {
    		console.log('val', this.$(':checked').val());

    		$('select').prop('selectedIndex', 0);
    		//call to sort items
    		this.sort_works();

    		//call to sort the text that goes with each sort type
    		this.sort_texts();
    		
       },

       sort_works: function(){

       	    //reset works and texts collection
        	works_collection.reset();


			//from the specific check box sort type determine if all or or specific type needs to be added
       		if(this.$(':checked').val() == 'All'){
        		//sorted works is all the works broken up into two arrays for 'Work' and 'Manuscript'
				var sortedWorks = items.groupBy(function(work) {
				 	return work.get("all");
				});

				//add to works_collection from work_type
				 _.each(sortedWorks, function(work) {
					works_collection.add(work);
				});
				
				//empty the list
				this.list.empty();

	        	//the list of items- rendering based on the choice of the user
				works_collection.each(function(item){
					

					var view = new itemView({ model: item });
					this.list.append(view.render().el);
					

				}, this);
				
        	}else{
        		//sorted works is all the works broken up into two arrays for 'Work' and 'Manuscript'
				var sortedWorks = items.groupBy(function(work) {
				 	return work.get("type");
				});

				//work_type is all sorted works with type 'Work'
				sortedWorks = _.first(_.values(_.pick(sortedWorks, this.$(':checked').val())));

				//add to works_collection from work_type
				 _.each(sortedWorks, function(work) {
					works_collection.add(work);
				});
				
				//empty the list
				this.list.empty();

	        	//the list of items- rendering based on the choice of the user
				works_collection.each(function(item){
					

					var view = new itemView({ model: item });
					this.list.append(view.render().el);
					

				}, this);


			
        	}
        	
       },

       sort_texts: function(){

        	//reset texts
			texts_collection.reset();

			
        	//sorted works is all the works broken up into two arrays for 'Work' and 'Manuscript'
			var sortedText = texts.groupBy(function(work) {
				 return work.get("type");
			});
        	
        	//puts the items with the specific check box attribute into sorted workds, overwriting it
			sortedText= _.first(_.values(_.pick(sortedText, this.$(':checked').val())));

			//adds each element in sortedTest to the texts_collection to be rendered
			 _.each(sortedText, function(work) {
				texts_collection.add(work);
			});

			this.txt.empty();

			//the list of items- rendering based on the choice of the user
			texts_collection.each(function(text){
				var view = new textView({ model: text });
				this.txt.append(view.render().el);

			}, this);

       }
    
	});

	// The main view of the application
	var App = Backbone.View.extend({

		// Base the view on an existing element
		el: $('#main'),
		
		initialize: function(){
			//initialize list and txt
			this.list = $('#items');
			this.txt = $('#texts');
			this.drp = $('#drp');

			//new check box view- render them
			this.checkView = new checkView({el: $("#checkBoxes_container") });

			this.drpView = new drpView({el: $("#drp_container") });
			
			//the list of items- rendering based on the choice of the user
			texts_collection.each(function(text){
				var view = new textView({ model: text });
				this.txt.append(view.render().el);

			}, this);

			//the list of items- rendering based on the choice of the user
			drops.each(function(drp){
				var view = new drpView({ model: drp });
				this.drp.append(view.render().el);

			}, this);

		},

		//render the app
		render: function(){

			return this;
		}

	});

//create app
	new App();

});