document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-search').onclick = function () {
    const keyValue = document.querySelector('#key-value').value;
    const startDate =  document.querySelector('#start-date').value;
    const endDate =  document.querySelector('#end-date').value;
    const radius =  document.querySelector('#radius').value;
    const formData = {
      keyValue, startDate, endDate, radius,

    };
    axios.post('/events/eventsmap', {
      formData,
    }).then((ticketMasterResponse) => {
      console.log(ticketMasterResponse);
    })
      .catch((error) => {
        console.log(error);
      });
  };
}, false);
