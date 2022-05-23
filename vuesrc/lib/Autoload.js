$(document).ready(() => {
  //selectpicker config
  $.fn.selectpicker.Constructor.BootstrapVersion = "4";

  //sidebar actions
  $(document).on("mouseenter", ".sidenav", function() {
    $(this).addClass("hovered");

    if (!$("body").hasClass("g-sidenav-pinned")) {
      $("body")
        .removeClass("g-sidenav-hide")
        .removeClass("g-sidenav-hidden")
        .addClass("g-sidenav-show");
    }
  });

  $(document).on("mouseleave", ".sidenav", function() {
    $(this).removeClass("hovered");

    if (!$("body").hasClass("g-sidenav-pinned")) {
      $("body")
        .removeClass("g-sidenav-show")
        .addClass("g-sidenav-hide");

      setTimeout(function() {
        $("body")
          .removeClass("g-sidenav-hide")
          .addClass("g-sidenav-hidden");
      }, 300);
    }
  });

  $(document).on("click", ".dont-collapse", function(e) {
    e.stopPropagation();
  });

  //validator additional methods
  $.validator.addMethod(
    "regex",
    function(value, element, param) {
      const [expression, flag] = param.split("|");

      regexp = new RegExp(expression, flag);

      return this.optional(element) || regexp.test(value);
    },
    $.validator.format("Regex failed.")
  );

  $.validator.addMethod(
    "inArray",
    function(value, element, param) {
      const arr = param.split(",");

      return this.optional(element) || arr.includes(value);
    },
    $.validator.format("Does not exists in array.")
  );

  jQuery.validator.addMethod(
    "regexCustomMessage",
    jQuery.validator.methods.regex,
    "Only alphanumeric characters, some special characters and spaces are allowed."
  );

  jQuery.validator.addMethod(
    "inArrayCustomMessage",
    jQuery.validator.methods.inArray,
    "Bank BIC does not exist."
  );

  jQuery.validator.addClassRules("customValidationOutwardDefaultForm", {
    regexCustomMessage: "^([a-zA-Z0-9\\/\\-\\?:\\(\\)\\.,'\\+ ]*)$",
  });

  // jQuery.validator.addClassRules("customValidationOutwardCheckBICForm", {
  //   inArrayCustomMessage: vm.bankList.map((bank) => bank.BICFI).join(","),
  // });

  $(document).on("shown.bs.modal", ".modal", function(e) {
    $(this).removeAttr("tabindex");
  });
});
