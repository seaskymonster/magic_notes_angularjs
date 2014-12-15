Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

var Notebook = Backbone.Model.extend({
	initialize : function() {
		//alert('Hey, you create me!');
	},
	defaults : {
		'user_id' : 0,
		'name' : "defalt",
		'date' : "",
		'template_id' : 0,
		'notes_num' : 0,
		'private' : 0,
		'id' : 0,
	},
});

var Notebooks = Backbone.Collection.extend({
	model : Notebook,
	initialize : function(models, options) {
		this.q = options.q
	},
	url : function() {
		url = "/notebook/" + this.q;
		return url;
	},
});

var NotebookView = Backbone.View.extend({
	tagName : "li",
	className : "Notebook",
	events : {
		//"click .bookname": "openNotebook",
	},
	events:{
		"click .deleteNotebookButton":"deleteNotebook",
	},
	deleteNotebook:function(event) {
		console.log(event);
		event.preventDefault();
		event.stopPropagation();
		console.log("bind delete note book");
		that = this;
		$(this.el).simpledialog({
			'mode' : 'bool',
			'prompt' : 'Do you really want to delete notebook:' +this.model.get('name')+'?',
			'buttons' : {
				'OK' : {
					click : function() {
						event.preventDefault();
						$.ajax({
							type:"POST",
							url : "/notebook/deleteBook",
							data : {
								noteBookId :that.model.get('id')
							},
							success : function() {
								//alert("deleteNotebookButton success");
								return false;
							},
						})
					}
				},
				'Cancel' : {
					click : function() {
						event.preventDefault();
					},
					icon : "delete",
					theme : "c"
				}
			}
		})
	},

	openNotebook : function() {
		console.log(this.model.get('id'));
		//window.location.href = "NoteNook/"+this.model.get('id');
		//appRouterInstance.navigate("NoteBook/"+this.model.get('id'));
		appRouterInstance.navigate("NoteBook/" + this.model.get('id'), {
			trigger : true
		});
		if (this.query == 'getPublicBookList'){
			
			console.log("public");
		}
			
		else{
			console.log("not public");
		}
			
		//app.navigate("NoteNook/"+this.model.get('id'), {trigger: true});

	},

	render : function() {

		$(this.el).html('');
		data = {
			"notebookID" : this.model.get('id'),
			"notebookName" : this.model.get('name'),
			"notes_num" : this.model.get('notes_num'),
			//            "private":this.model.get('private'),
			//            "pic": this.model.get('pic'),
			//            "address": this.model.get('address'),
			//            "reward_number": this.model.get('rewards').length,
		};
		console.log("cool+" + this.query);
		if (this.query != 'getPublicBookList')
			data["delete_enable"] = true;
		that = this;
		dust.render("notebooklist", data, function(err, out) {    //dust render...
			//console.log(out);
			if (!err) {
				$(that.el).html(out.toString());

			} else {
				return console.log(err);
			}
		});
		//

		return $(this.el);
		// return $(this.el).html("<div class='bookname'>"+this.model.get('name')+"</div>");
	},
});

var NotebooksView = Backbone.View.extend({
	className : "Notebooks",
	tagName : "ul",
	
	initialize : function(options) {

		this.query = options.q;
		var notebooksCollection = new Notebooks([], {  
			'q' : options.q
		});
		this.collection = notebooksCollection;
		that = this;
		notebooksCollection.fetch({   //get the notebooks from database;
			success : function(collection) {
                console.log(collection.toJSON());
				//$('#content').html(myNotebooksView.render());
				//$('#content').trigger('create');
				//that.changePage(myNotebooksView);
				that.render();
			}
		});

	},

	render : function() {
		//$(this.el).html('');
		$(this.el).attr("data-role", "listview");
		$(this.el).attr("data-filter", "true");
		$(this.el).attr("data-split", "d");
		$(this.el).attr("data-split-icon", "delete");

		$(this.el).html('');
		console.log("NotebooksViewrender");
		//$(this.el).css("display","none");
		that = this;
		this.collection.each(function(notebook) {   //this.collection== notebooksCollection.
			var notebookView = new NotebookView({ 
				model : notebook,
			});
			notebookView.query = that.query;
			$(notebookView.el).attr("data-query", that.query);
			$(this.el).append(notebookView.render());
			//console.log($(this.el));
		}, this);
		this.afterrender();
		return $(this.el);
	},
	afterrender : function() {
		console.log("after redner")
	},
	
});

