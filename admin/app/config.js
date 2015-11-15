// Api Path

var switch_tabs_config = {
  api_server : '/api/'
};

//Colors by Answers

var Answer = {
  excelente : '#39b54a',
  bueno : '#ffdb09',
  regular : '#ef8126',
  malo : '#dd0717',
  si : '#248a32',
  no : '#bb0a18',
  hombre : '#6995ee',
  mujer : '#d38ab7'
};

_.mixin({
  'findByValues': function(collection, property, values) {
    return _.filter(collection, function(item) {
      return _.contains(values, item[property]);
    });
  }
});

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return (dd[1]?dd:"0"+dd[0])+'-'+ (mm[1]?mm:"0"+mm[0])+'-'+yyyy; // padding
};