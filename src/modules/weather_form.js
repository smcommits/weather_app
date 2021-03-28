const formModule = (() => {
  const submitButton = document.getElementById('weather-submit');
})();

const getFormData = () => {
  const input =  document.getElementById('location');

  return input.value
}
