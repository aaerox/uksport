(function() {
  var ExampleClass;

  ExampleClass = (function() {
    function ExampleClass() {
      $('html').click((function(_this) {
        return function() {
          return alert("hi");
        };
      })(this));
    }

    return ExampleClass;

  })();

  new ExampleClass();

}).call(this);
