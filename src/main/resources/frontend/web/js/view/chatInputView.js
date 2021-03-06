App.ChatInputView = Ember.TextArea.extend({
  attributeBindings: ['value', 'type', 'size', 'name', 'placeholder', 'disabled', 'maxlength'],	
  maxlength : "200",
  elementId : "chat-input",
  valueBinding: 'controller.content',
  placeholder : "Type message...",

  insertNewline: function() {
    this.get('controller').sendChatMessage();
  }
});