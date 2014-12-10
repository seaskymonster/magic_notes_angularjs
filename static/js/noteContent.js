var NoteContent = Backbone.Model.extend({
    initialize: function(options) {
    	this.id=options.noteid;
        //alert('Hey, you create me!');
    },
    url: function(){
    	return "notes/getNoteContent?noteId="+this.id;
    },
    defaults: {
    	"id":0,
    	"notebook_id":'',
    	"notename":'',
    	"create_date":'',
    	"last_modify":'',
    	"content":'',
    },
});

var NoteContentView = Backbone.View.extend({
    tagName: "div",
    className: "NoteContent",
    events: {
        "click #saveNoteButton": "saveNote",
    },
    saveNote: function() {
    console.log("cool");
		var saveNoteData = {
			'noteId' : $(".NoteContent").attr("note-id"),
			'notebookId' : $(".NoteContent").attr("notebook-id"),
			'notename' : $("#noteName").val(),
			'content' : $("#noteContent").val(),
		};
		console.log(saveNoteData);
		if (saveNoteData.notebookId == undefined) {
			$.ajax({
				type : "POST",
				url : "/notes/saveNote",
				data : saveNoteData,
				success : function(res) {
                    
					console.log("success");
					// appRouterInstance.navigate("NoteBook/", {
					// 	trigger : true
					// });
					window.history.back();
				}
			});
		} else {
			$.ajax({
				type : "POST",
				url : "/notes/createNote",
				data : saveNoteData,
				success : function(res) {
                
					appRouterInstance.navigate("NoteBook/" + saveNoteData.notebookId, {
						trigger : true
					});
				}
			});
		}
	},
    initialize:function(options){
        var notecontent=new NoteContent({
            noteid:options.noteid,
        });
        this.model=notecontent;
    	

    	// this.model=new NoteContent({
    	// 	noteid:options.noteid,
    	// });
    	that=this;
    	notecontent.fetch({  //get data from database;;;
           
    	    success: function(model) {
              //  debugger;
    	       console.log(model.toJSON());   // why this is not the orginal object get from the database...
    	       that.render();
    	    }
    	});
    	
    },
   
    render: function() {
         $(this.el).html('');
         console.log(this.model);
         console.log(this.model.get('content'));

         $(this.el).attr("note-id",this.model.get('id'));
         //$(this.el).attr("notebook-id",this.model.get('notebook_id'));

         data = {
            'noteID': this.model.get('id'),
            "noteName": this.model.get('notename'),
			'notebook_id':this.model.get('notebook_id'),
	    	'create_date':this.model.get('notename'),
	    	'last_modify':this.model.get('create_date'),
	    	'noteContent':this.model.get('content'),
         };
         if(this.model.get('ownership')==false){
            data.publicNoteTag = "exist";
         }
         console.log(data);
         my = this;
         dust.render("noteedit", data, function(err, out) {
             if(!err) {
                 $(my.el).html(out.toString());
             } else {
                 return console.log(err);
             }
             console.log($(my.el).html());
         });
         this.afterrender();
         return $(my.el);
    	//return $(this.el).html(this.model.get('notename'));
    },
});

