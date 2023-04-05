var Backbone = require('../node_modules/backbone/backbone');
var $ = require('../node_modules/jquery/dist/jquery');
var _ = require('../node_modules/underscore/underscore');

//=============================================
// Model
//=============================================
var Item = Backbone.Model.extend({
  defaults: {
  text: '',
  isDone: false,
  editMode: false,
  show: true
  }
});

var Form = Backbone.Model.extend({
  defaults: {
  val: '',
  hasError: false,
  errorMsg: ''
  }
});
var form = new Form();

//検索
var Search = Backbone.Model.extend({
  defaults:{
  val:'',
  }
});
var search = new Search();	

//=============================================
// Collection
//=============================================
var LIST = Backbone.Collection.extend({
  model: Item
});

var item1 = new Item({text: 'sample todo1'});
var item2 = new Item({text: 'sample todo2'});
var list = new LIST([item1, item2]);

//=============================================
// View
//=============================================
var ItemView = Backbone.View.extend({
  template: _.template($('#template-list-item').html()),
  events: {
  'click .js-toggle-done': 'toggleDone',
  'click .js-click-trash': 'remove',
  'click .js-todo_list-text': 'showEdit',
  'keyup .js-todo_list-editForm': 'closeEdit',
  },
  initialize: function (options) {
  _.bindAll(this, 'toggleDone', 'render', 'remove', 'showEdit', 'closeEdit');
  // オブザーバパターンを利用してモデルのイベントを購読
  this.model.bind('change', this.render);
  this.model.bind('destroy', this.remove);
  },
  toggleDone: function () {
  this.model.set({isDone: !this.model.get('isDone')});
  },
  remove: function () {
  this.$el.remove();
  return this;
  },
  showEdit: function () {
  this.model.set({editMode: true});
  },
  closeEdit: function (e) {
  if(e.keyCode === 13 && e.shiftKey === true){
    this.model.set({text: e.currentTarget.value, editMode: false});
  }
  },
  render: function () {
  console.log('ohoho');
  var template = this.template(this.model.attributes);
  this.$el.html(template);
  return this;
  }
});

var ListView = Backbone.View.extend({
  el: $('.js-todo_list'),
  collection: list,
  initialize: function(){
  _.bindAll(this, 'render', 'addItem', 'appendItem');
  this.collection.bind('add', this.appendItem);
  this.render();
  },
  addItem: function (text) {
  var model = new Item({text: text});
  this.collection.add(model); // add イベントが発生し、this.appendItem が呼ばれる
  },
  appendItem: function (model) {
  var itemView = new ItemView({model: model});
  this.$el.append(itemView.render().el);
  },
  render: function () {
  console.log('render list');
  var that = this;
  this.collection.each(function(model, i) {
    that.appendItem(model);
    
  });
  return this;
  }
});
var listView = new ListView({collection: list});

var FormView = Backbone.View.extend({
  el: $('.js-form'),
  template: _.template($('#template-form').html()),
  model: form,
  events: {
  'click .js-add-todo': 'addTodo'
  },
  initialize: function(){
  _.bindAll(this, 'render', 'addTodo');
  this.model.bind('change', this.render);
  this.render();
  },
  addTodo: function(e){
  e.preventDefault();
  //新規のタスクの文字が空だった場合
    if($('.js-get-val').val() === ''){
    console.log('からだね');
    this.model.set({ hasError: true});
    this.model.set({ errorMsg: 'あはははは！'});
    $('.js-error-text').show();
    console.log(this.model);
    }else{
    this.model.set({val: $('.js-get-val').val()});
    listView.addItem(this.model.get('val'));	
    }
},
  render: function () {
  var template = this.template(this.model.attributes);
  this.$el.html(template);
  return this;
  }
});
new FormView();

//検索のビュー
var SearchView = Backbone.View.extend({
  el:$('.searchBox'),
  model:search,
  collection:list,
  
  initialize:function(){
  _.bindAll(this,'render','search','searchList');
  this.render();
  },

  events:{
  'keyup .js-search':'search'
  },
  search:function(){
  this.model.set({val:$('.js-search').val()});
  //this.model.set({show: !this.model.get('show')});
  this.searchList();
  },
  
  searchList:function(){
  var regExp = new RegExp('^' + this.model.get('val'));
  console.log(regExp);
  
  //ループで回して、全てのタスクを取ってくる
  this.collection.each(function(model,i){
    //タスクの文字列と比較する
    var val = model.get('text');

    //前方一致で一致している場合はtrue/falseを付け替える　
    if(val.match(regExp)){
    console.log(`${i}番目の${val}はヒットしました`);
    model.set({show: true});
    console.log('モデルさんの中身：' + model.get('show'));
    var flg = model.get('show');
    $('js-todo_list-item').show();
    }else{
    console.log(`${i}番目の${val}はハズレです`);
    model.set({show: false});
    console.log('モデルさんの中身：' + model.get('show'));
    var flg = model.get('show');
    $('js-todo_list-item').hide();
    }
  });
  },

  render:function(){
  return this;
  }
});
new SearchView();

//検索後のリストView
var ShowItemList = Backbone.View.extend({
  el: $('.js-todo_list-item'),
  collection: list,
  model: Item,

  //イニシャライズ
  initialize: function(){
    _.bindAll(this, 'render', 'wakaran'),
    this.wakaran(),
    this.render()
  },		

  //wakaran
  wakaran: function(){
    var thisclass = this.el;

    //var modelkun = new Item;

    //console.log('こっちのモデル' + model);
    console.log('これは？' + modelsan);
    var flag = modelkun.get('show');
    console.log('フラグ：' + flag);

    //showがtrueのものだけを表紙
    if(flag === true){
      $(thisclass).show();
      console.log('showの分岐');
    }else{
      $(thisclass).hide();
      console.log('hideの分岐');
    }  
  },
  
  //render
  render: function(){
    console.log('renderは走ってる');
    return this;
  }
});
