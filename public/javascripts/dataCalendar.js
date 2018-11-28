document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelectorAll('.datepicker');
  const instances = M.Datepicker.init(picker, {
    format:'yyyy-mm-dd',
    setDefaultDate: true,
    defaultDate: new Date(),
  });
});
