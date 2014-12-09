







$(document).ready(function() {
	$.ajaxSetup({
		beforeSend : function() {
			$.mobile.loading('show',{
				text: 'Loading',
				textVisible: true,
				theme: 'a',
				html: ""
			});
		},
		complete : function() {
			$.mobile.loading('hide');
		}
	});
}); 



var AppRouter = Backbone.Router.extend({

	routes : {
		//"help" : "help", // #help
		//"search/:query" : "search", // #search/kiwis
		//"search/:query/p:page" : "search", // #search/kiwis/p7
		"" : "loginView",
		"NoteBookList" : "noteBookList",  //mark
		"getPublicBookList" : "getPublicBookList",
		"NoteBook/:notebookid" : "noteList",  //mark
		"PublicNoteBook/:notebookid" : "publicnoteList",
		"Usersetting" : "usersetting",
		"Note/:noteid":"note", //marking
		"NewNote/:notebookid":"newNote",
		"NewUser":"newUser",
	},

	help : function() {

	},
	
	note:function(noteid){
		noteContentView = new NoteContentView({
			noteid:noteid,
		});
		this.changePage(noteContentView);
		$("#addNewNotebookButton").css("display","none");
		$("#addNewNoteButton").css("display","none");
	},
	newNote:function(notebookid){
		console.log("hahahahah" + notebookid);
		var note = new Note();
		noteContentView = new NoteContentView({
			noteid:"",
		});
		noteContentView.modal = note;

		console.log("hahahahah" + notebookid);
		this.changePage(noteContentView);

		$(noteContentView.el).attr("notebook-id",notebookid);

		noteContentView.render();
		$("#addNewNotebookButton").css("display","none");
		$("#addNewNoteButton").css("display","none");
	},
	usersetting : function() {
		userSettingView = new UserSettingView({
		});
		this.changePage(userSettingView);
		
		$(document).ready(function() {
			$("#addNewNotebookButton").css("display","none");
			$("#addNewNoteButton").css("display","none");
			$("#homeNavi").removeClass('ui-btn-active');
			$("#publicNavi").removeClass('ui-btn-active');
			$("#settingNavi").addClass('ui-btn-active');
		});

	},
	noteList : function(notebookid) {
		console.log(notebookid);
		newNotesView = new NotesView({
			notebookid : notebookid,
			ownership:true,
		});
		$("#addNewNotebookButton").css("display","none");
		$("#addNewNoteButton").css("display","block");
		this.changePage(newNotesView);
		
		
		

	},
	publicnoteList : function(notebookid) {
		console.log(notebookid);
		newNotesView = new NotesView({
			notebookid : notebookid,
			ownership:false,
		});
		$("#addNewNotebookButton").css("display","none");
		$("#addNewNoteButton").css("display","none");
		this.changePage(newNotesView);
		
		

	},

	noteBookList : function() {
		console.log("notebooklist");  // yes
		var newNotebooksView = new NotebooksView({'q':'getBookList'});
		this.changePage(newNotebooksView);
		$(document).ready(function() {
			$("#addNewNotebookButton").css("display","block");
			$("#addNewNoteButton").css("display","none");
			$("#homeNavi").addClass('ui-btn-active');
			$("#publicNavi").removeClass('ui-btn-active');
			$("#settingNavi").removeClass('ui-btn-active');
		});
		
		bindNewBookFunction(newNotebooksView);
		
		
	},
	getPublicBookList : function() {
		//console.log("getPublicBookList");
		var newNotebooksView = new NotebooksView({'q':'getPublicBookList'});
		this.changePage(newNotebooksView);
		$(document).ready(function() {
			$("#addNewNotebookButton").css("display","none");
			$("#addNewNoteButton").css("display","none");
			$("#homeNavi").removeClass('ui-btn-active');
			$("#publicNavi").addClass('ui-btn-active');
			$("#settingNavi").removeClass('ui-btn-active');
		});
		
	},
	loginView: function(){  //the first function it will use..
		var loginView = new LoginView();
		this.changePage(loginView);
		console.log("loginview");
		$("#addNewNotebookButton").css("display","none");
		$("#addNewNoteButton").css("display","none");
	},
	newUser: function(){
		var newUserView = new NewUserView();
		this.changePage(newUserView);
		setTimeout(function(){
			
		});
		newUserView.render();
		$("#addNewNotebookButton").css("display","none");
		$("#addNewNoteButton").css("display","none");
	},
	changePage : function(page) {
		//$(page.el).attr('data-role', 'page');
		page.afterrender=function(){
			$('#content').html($(page.el));
			$('#content').trigger('create');
		};
		//page.render();
		// setTimeout(function(){
			// $('#content').html($(page.el));
			// $('#content').trigger('create');
		// },500)
		
		//$.mobile.changePage($(page.el), {changeHash:false});
		//$('#content').trigger('create');
		//$.mobile.changePage($(page.el), {changeHash:false});
	},
});

//$(document).bind("mobileinit", function() {
	console.log("shutdown JQM router");
	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
//});

var appRouterInstance = new AppRouter();
Backbone.history.start();


function bindNewBookFunction(newNotebooksView){
	//$("#createNewNotebookButton").off("click"); 
	$(document).off("click","#createNewNotebookButton");
	console.log("cool");
	$(document).on("click","#createNewNotebookButton",function(){ 
		//$("#createNewNotebookButton").off("click"); 
		var newNotebookName = $("#newNotebookName").val();
		var isPrivateCheckbox = $("#isPrivateCheckbox").attr('checked');
		var isPrivate = (isPrivateCheckbox == "checked") ? 0 : 1;
	    console.log(isPrivate);
	    if(newNotebookName != ""){
	        $.ajax({
	            type: "POST",
	            url: "/notebook/createNotebook",
	            data: { strNotebookName: newNotebookName, isPrivate: isPrivate},
	            success: function (res) { 
	            	res=jQuery.parseJSON( res );
	            	res=res[0];
	                //console.log(res.noteBookInfo);
	                $("#add-notebook").panel("close");
	                newNoteBookModel=new Notebook(res);
	                newNotebooksView.collection.add(newNoteBookModel);
	                newNotebooksView.render();
	                appRouterInstance.navigate("NoteBookList", {trigger: false});
	            }
	        });
	    }else{
	    	$("#add-notebook").panel("close");
		}    
	}); 
	
}


$(function() {
	$('#addNewNoteButton').on('click', function() {
		console.log($(".Notes").attr("notebook-id"));
		appRouterInstance.navigate("NewNote/" + $(".Notes").attr("notebook-id"), {
			trigger : true
		});
	});
	$("#goBackButton").on('click', function() {
		window.history.back();
	});
})
