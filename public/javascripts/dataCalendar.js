
 document.addEventListener('DOMContentLoaded', function() {

  const picker = document.querySelectorAll('.datepicker');
  const instances = M.Datepicker.init(picker,{
    setDefaultDate: true,
    defaultDate: new Date()
  });


});