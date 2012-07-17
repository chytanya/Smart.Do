Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}


var max_todos = 5;

var todos = { active : [] , completed: [] , active_count: 0, complete_count: 0 };
//localStorage.removeItem('SmartDo.todos');
if(!localStorage.getObject('SmartDo.todos')){
	localStorage.setObject('SmartDo.todos', todos);
}


console.log('here');


// EXTENSION APP
	
    // App Model
    // ----------
    var ToDo = Backbone.DeepModel.extend({});

    // ToDo View
    // --------------

	var ToDoView = Backbone.View.extend({
        
        el: $("#app .content"),

		events: {
			'click	#app #create .content #create-btn' 			: 	'createNew',
			'click  #app #create .content #cancel-btn'			: 	'cancelNew',
			'click  #app #todos .icon-trash'					: 	'deleteTask',
			'mouseup  #app #todo-list .todo .text'				: 	'searchBySelection'
		},

		render: function(){
			var todos = localStorage.getObject('SmartDo.todos');
			var todosTemplate = _.template($('#todo-list-template').html());
			var todoTemplate = _.template($('#todo-template').html());

			$("#app #todos .content").html( todosTemplate({ todos : localStorage.getObject('SmartDo.todos'), todoTemplate : todoTemplate }));
			$('a[href="#todos"]').tab('show');
		},

		renderSettings: function(){
			var settingsTemplate = _.template($('#settings-template').html());
			$("#app #settings .content").html( settingsTemplate({ settings : localStorage.getObject('SmartDo.settings') }));
			$('a[href="#settings"]').tab('show');
		},

		renderCreate : function(){
			var createTodoTemplate = _.template($('#create-todo-template').html());
			$("#app #create .content").html( createTodoTemplate({}));
			$('a[href="#create"]').tab('show');
			$('#schedule').datetimepicker();
		},

		renderTodoDetails : function(){
			var todoDetailsTemplate = _.template($('#todo-details-template').html());
			$("#app #todo-details .content").html( todoDetailsTemplate({  }));
		},

		createNew: function(e){
			var todos = localStorage.getObject('SmartDo.todos');
			var newTodo = { 
							label 			: 	$('#create #label').val(), 
							due_datetime 	: 	$("#create #schedule").datetimepicker( 'getDate' ), // moment($(".smart-do").datetimepicker( 'getDate' )).fromNow()
							created 		: 	moment().toString(),
							id 				:   'sd_' + moment().unix()
						};
			todos.active.push(newTodo);
			
			localStorage.setObject('SmartDo.todos', todos);
			this.render();
		},

		cancelNew: function(){
			this.render();
		},

		deleteTask: function(e){
			var todo_id = $(e.target).parents('.todo').attr('data-todo-id');
			if(todo_id){
				var todos = localStorage.getObject('SmartDo.todos');
				console.log('before ', todos);
				todos.active = _.reject(todos.active, function(todo){
					return todo.id == todo_id;
				});
								console.log('after ', todos);

				localStorage.setObject('SmartDo.todos', todos);
				todoView.render();
			}
		},

		searchBySelection: function(e){
			var selectedText = getSelectionText()
		    if (selectedText) {
		      //console.log('the selected text', selectedText); 
		      initializeSearch(selectedText.trim());
		    }
		}

	});


	// start application
	todoView = new ToDoView();
	todoView.renderSettings();
	todoView.renderCreate();
	todoView.render();


	// get highlighted text
	function getSelectionText() {
	    var text = "";
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	}
