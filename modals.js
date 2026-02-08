
function showAlertModal(message, triggerButton) {
  const alertHTML = `
    <div id="alertModal" style="display:none; position:absolute; background:#ffffff; padding:20px; border:1px solid #34568B; box-shadow:0 4px 8px rgba(0,0,0,0.2); border-radius:8px; z-index:1001;">
      <p style="margin:0; font-size:16px; color:#333;">${message}</p>
      <div style="margin-top:20px; text-align:center;">
        <button id="alertOk" style="background:#34568B; color:#ffffff; border:none; border-radius:4px; padding:10px 20px; font-size:16px; cursor:pointer;">OK</button>
      </div>
    </div>
    <div id="overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;"></div>
  `

  document.body.insertAdjacentHTML('beforeend', alertHTML)

  const alertModal = document.getElementById('alertModal')
  const overlay = document.getElementById('overlay')

  const rect = triggerButton.getBoundingClientRect()
  alertModal.style.top = `${rect.top + window.scrollY + 35}px`
  alertModal.style.left = `${rect.left + window.scrollX}px`

  alertModal.style.display = 'block'
  overlay.style.display = 'block'

  document.getElementById('alertOk').onclick = () => {
    alertModal.style.display = 'none'
    overlay.style.display = 'none'
    alertModal.remove()
    overlay.remove()
    // no reload
  }
}

document.getElementById('sendButton').addEventListener('click', async (event) => {
  event.preventDefault();
  const name = document.getElementById('nameField').value;
  const email = document.getElementById('emailField').value;
  const message = document.getElementById('messageField').value;
  const redirectApiHost = 'https://gateway.silver-service.com.ua:8008/api/liqpay/callback/send-msg/';
  const apiAddress = `${redirectApiHost}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`;
  try {
    const response = await fetch(apiAddress, {
      method: "GET",
      mode: "cors",
      cache: "no-cache"
    });
    const urlParams = new URLSearchParams(window.location.search);
    let language = urlParams.get('lang');
    if (!language) {
      language = document.documentElement.lang || 'en';
    }
    let successMessage, errorMessage;
    if (language === 'uk') {
      successMessage = 'Повідомлення успішно надіслано';
      errorMessage = 'Помилка при відправці повідомлення';
    } else if (language === 'pl') {
      successMessage = 'Wiadomość została pomyślnie wysłana';
      errorMessage = 'Błąd podczas wysyłania wiadomości';
    } else {
      successMessage = 'Message sent successfully';
      errorMessage = 'Error sending message';
    }
    if (response.ok) {
      showAlertModal(successMessage, event.target);
    } else {
      showAlertModal(errorMessage, event.target);
    }
  } catch (error) {
    showAlertModal('An error occurred while sending the message. Please try again later.', event.target);
  }
});