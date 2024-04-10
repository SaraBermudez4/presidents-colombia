import formatDate from './utils/formatDate.js';

$(function () {
  $.get(
    'https://api-colombia.com/api/v1/President',
    function (data: PresidentResponse[]) {
      let select = $('#select-name-president');
      data
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((president: PresidentResponse) =>
          select.append(
            $('<option>', {
              value: president.id,
              text: `${president.name} ${president.lastName}`,
            })
          )
        );
      $('#president-info').hide();
    }
  );

  $('#select-name-president').change(function () {
    let id: string = ($(this).val() as string).toString();
    if (!id) {
      $('#president-info').hide();
      return;
    }

    $.get('https://api-colombia.com/api/v1/President/' + id)
      .done(function (president: PresidentResponse) {
        $('#president-name').text(`${president.name} ${president.lastName}`);
        $('#president-startPeriodDate').text(
          formatDate(president.startPeriodDate)
        );
        $('#president-endPeriodDate').text(formatDate(president.endPeriodDate));
        $('#president-politicalParty').text(president.politicalParty);
        $('#president-description').text(president.description);
        $('#president-city').text('');

        if (!president.image) {
          $('#president-image').hide();
        } else {
          $.get(president.image)
            .done(function () {
              $('#president-image')
                .attr('src', president.image ?? '')
                .show();
            })
            .fail(function () {
              $('#president-image').hide();
            });
        }

        $.get(`https://api-colombia.com/api/v1/City/${president.cityId}`)
          .done((city: { name: string }) =>
            $('#president-city').text(city.name)
          )
          .fail(() => $('#president-city').text('No se encontró la ciudad'));

        $('#president-info').show();
      })
      .fail(function () {
        alert(
          'Hubo un error al cargar la información del presidente seleccionado. Por favor, intenta de nuevo.'
        );
        $('#president-info').hide();
      });
  });
});

interface PresidentResponse {
  id: string;
  name: string;
  lastName: string;
  startPeriodDate: string;
  endPeriodDate: string;
  politicalParty: string;
  description: string;
  image?: string;
  cityId?: string;
}
