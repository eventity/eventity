document.addEventListener('DOMContentLoaded', () => {
  const options = {

    url: '/javascripts/options.json',

    getValue: 'name',

    list: {
      match: {
        enabled: true,
      },
      maxNumberOfElements: 5,

      showAnimation: {
        type: 'fade',
      },
      hideAnimation: {
        type: 'fade',
      },
    },

    theme: 'square  ',
  };
  $('.autocomplete').easyAutocomplete(options);
});
