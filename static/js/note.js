Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

var Note = Backbone.Model.extend({
    initialize: function() {
        //alert('Hey, you create me!');
    },
    defaults: {
    	id:0,
    	user_id:0,
    	notebook_id:0,
    	notename:'',
    	create_date:'',
    	last_modify:'',
    	content:'',
    },
});

var Notes = Backbone.Collection.extend({
    model: Note,
    notebookid:0,
    initialize: function(options) {
    	this.notebookid=options.notebookid;
        // this.ownership=options.ownership;  //add by wenlai
    },
    url: function() {
        return "/notes/getNoteList?notebookId="+this.notebookid;
    },
});

var NoteView = Backbone.View.extend({
    tagName: "li",
    className: "Note",
    events: {
        "click .notename": "openNote",
        "click .deleteNoteButton":"deleteNote",
    },
	deleteNote:function(event) {
		event.preventDefault();
		console.log("bind delete note");
		
		that = this;
		$(this.el).simpledialog({
			'mode' : 'bool',
			'prompt' : 'Do you really want to delete node:' +this.model.get('notename')+'?',
			'buttons' : {
				'OK' : {
					click : function() {
						$.ajax({
							url : "/notes/deleteNote",
                            type: "POST",
							data : {
								noteId :that.model.get('id'),
                               
							},
							success : function() {
                             
                                window.history.back();
								//alert("deleteNotebookButton success");
								return false;
							},
						})
					}
				},
				'Cancel' : {
					click : function() {
					},
					icon : "delete",
					theme : "c"
				}
			}
		})
	},

   
    render: function() {
    	//console.log("rr");
         $(this.el).html('');
         data = {
             "noteID": this.model.get('id'),
             "noteName": this.model.get('notename'),
 //            "pic": this.model.get('pic'),
 //            "address": this.model.get('address'),
 //            "reward_number": this.model.get('rewards').length,
         };
         //console.log(data);
         // debugger;
            console.log(this.model.ownership);
         my = this;

         if(this.model.ownership==true) { //change by wenlai
         	data.ownership=true;
         	//$("#addNewNoteButton").css("display","block");
         }else{
         	//$("#addNewNoteButton").css("display","none");
         }
         
         dust.render("notelist", data, function(err, out) {
             if(!err) {
                 $(my.el).html(out.toString());
             } else {
                 return console.log(err);
             }
         });
         return $(this.el);
    	//return $(this.el).html(this.model.get('notename'));
    },
    openNote:function(){
        appRouterInstance.navigate("Note/"+this.model.get('id'), {trigger: true});
		
    },
});

var NotesView = Backbone.View.extend({
    className: "Notes",
    tagName: "ul",
    initialize:function(options){ //get the notes belong to the user..from the api
    	this.notebookid=options.notebookid;
    	this.ownership=options.ownership;
    	console.log(this.notebookid);
        console.log(this.ownership);
    	var notesCollection=new Notes({notebookid:this.notebookid});  // owenership is added by wenlai
    	this.collection=notesCollection;
    	that=this;
    	console.log(notesCollection.url());
    	notesCollection.fetch({  //fetch data from api;;
    	    success: function(collection) {
    	       console.log(collection);
    	       that.render();

    	    }
    	});
    	
    },
    
    render: function() {  //render the notes belong to the user...
        $(this.el).attr("data-role","listview");
        $(this.el).attr("data-split","d");
        $(this.el).attr("data-filter","true");
        $(this.el).attr("data-split-icon","delete");
        if(this.ownership==true){
        	$("#addNewNoteButton").css("display","block");
        	console.log("owner");
        }
        	


        $(this.el).attr("notebook-id",this.notebookid);

        $(this.el).html('');   
        this.collection.each(function(note) { //give all the notes collect from api to noteView. to let noteView to render it...
             
             if(this.ownership){
                 note.ownership=true;
              ///add by wenlai
             }

             
                console.log(note);
            var noteView = new NoteView({  //noteView  // for every note create a NoteView for it
                model: note,
            });
            $(this.el).prepend(noteView.render());
            //console.log($(this.el));
        }, this);
        this.afterrender();
        return $(this.el);
    }

});



