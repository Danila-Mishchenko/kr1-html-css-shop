// ===== Модальное окно заявки (есть только на index.html) =====
const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  const orderButtons = document.querySelectorAll('.product-card__button');
  const closeButton = document.getElementById('close-order-dialog');
  const productInput = document.getElementById('order-product');
  const productLabel = document.getElementById('order-dialog-product');

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.dataset.product || '—';
      productInput.value = product;
      productLabel.textContent = product;
      orderDialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

// ===== Проверка форм заявки =====
function showError(field, message) {
  const error = field.closest('.order-form__field').querySelector('.order-form__error');
  field.classList.add('order-form__input--error');
  field.setAttribute('aria-invalid', 'true');
  error.textContent = message;
  error.hidden = false;
}

function clearError(field) {
  const error = field.closest('.order-form__field').querySelector('.order-form__error');
  field.classList.remove('order-form__input--error');
  field.removeAttribute('aria-invalid');
  if (error) {
    error.textContent = '';
    error.hidden = true;
  }
}

function validateField(field) {
  clearError(field);

  if (field.type === 'checkbox') {
    if (field.required && !field.checked) {
      showError(field, 'Необходимо согласие');
      return false;
    }
    return true;
  }

  const value = field.value.trim();

  if (field.required && value === '') {
    showError(field, 'Заполните это поле');
    return false;
  }

  if (field.type === 'email' && value !== '' && !field.checkValidity()) {
    showError(field, 'Введите корректный e-mail');
    return false;
  }

  return true;
}

document.querySelectorAll('.order-form').forEach((form) => {
  const successMessage = form.querySelector('.success-message');
  const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

  fields.forEach((field) => {
    field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      successMessage.hidden = false;
      const savedProduct = form.querySelector('input[type="hidden"]');
      const product = savedProduct ? savedProduct.value : '';
      form.reset();
      if (savedProduct) {
        savedProduct.value = product;
      }
    }
  });
});