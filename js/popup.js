Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}


var max_todos = 5;
var tag_list = [];



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
			'keypress  #app #create #create-tag'				: 	'createTags',
			'click  #app #todos .icon-trash'					: 	'deleteTask',
			'click  #app #todos #todo-list .get-details'		: 	'search',
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

		createTags: function(e){

			var target = $(e.target);

			if(e.keyCode == 13){
				e.preventDefault();
				var current_tag = $(target).text().trim();
				tag_list.push(current_tag);
				var current_tag_html = '<span class="label label-info">' + current_tag + '</span>';
				$(target).parent().find('#tags-holder').append(current_tag_html);
				$(target).text('');
			}	
		},


		createNew: function(e){
			var todos = localStorage.getObject('SmartDo.todos');
			var newTodo = { 
							label 			: 	$('#create #label').val(), 
							tags 			:  	tag_list,
							due_datetime 	: 	$("#create #schedule").datetimepicker( 'getDate' ), // moment($(".smart-do").datetimepicker( 'getDate' )).fromNow()
							created 		: 	moment().toString(),
							id 				:   'sd_' + moment().unix()
						};
			todos.active.push(newTodo);
			
			localStorage.setObject('SmartDo.todos', todos);
			tag_list = [];
			this.render();
		},

		cancelNew: function(){
			this.render();
		},

		search: function(e){

			var todo_id = $(e.target).parents('.todo').attr('data-todo-id');
			
			// check if the todo has a valid ID
			if(!todo_id){ console.log('No ID found for this DOM!'); return false; }
			
			// get all todos
			var todos = localStorage.getObject('SmartDo.todos');
			// Find the associated todo
			var current_todo = _.find(todos.active, function(todo){
				return todo.id == todo_id;
			})
			
			// No matching record found
			if(!current_todo){ console.log('No matching record found for ID: ', todo_id ); return false; }

			var tags = current_todo.tags;
			console.log('the tags', tags);

			_.each(tags, function(tag){
				initializeSearch(tag);
			});
			
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
		      console.log('the selected text', selectedText); initializeSearch(selectedText.trim());
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
