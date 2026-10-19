// ===== Вспомогательные функции для ошибок формы =====
function getErrorElement(field) {
  return field.closest('.order-form__field').querySelector('.order-form__error');
}

function showError(field, message) {
  const error = getErrorElement(field);
  field.classList.add('order-form__input--error');
  field.setAttribute('aria-invalid', 'true');
  error.textContent = message;
  error.hidden = false;
}

function clearError(field) {
  const error = getErrorElement(field);
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
      showError(field, 'Необходимо согласие на обработку данных');
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
    showError(field, 'Введите корректный e-mail, например name@example.com');
    return false;
  }

  if (field.type === 'tel' && value !== '' && !/^[+\d][\d\s()\-]{5,}$/.test(value)) {
    showError(field, 'Введите телефон в формате +7 (900) 000-00-00');
    return false;
  }

  return true;
}

// ===== Проверка форм заявки =====
document.querySelectorAll('.order-form').forEach((form) => {
  const successMessage = form.querySelector('.success-message');
  const fields = form.querySelectorAll('input[required], select[required], textarea[required], input[type="tel"]');

  fields.forEach((field) => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    let firstInvalid = null;
    fields.forEach((field) => {
      if (!validateField(field) && !firstInvalid) {
        firstInvalid = field;
      }
    });

    // Доступность: переводим фокус на первое поле с ошибкой
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    successMessage.hidden = false;

    const savedProduct = form.querySelector('input[type="hidden"]');
    const product = savedProduct ? savedProduct.value : '';
    form.reset();
    if (savedProduct) {
      savedProduct.value = product;
    }

    // Модальное окно закрывается автоматически через 2 секунды
    const dialog = form.closest('dialog');
    if (dialog) {
      setTimeout(() => dialog.close(), 2000);
    }
  });
});

// ===== Модальное окно заявки (есть только на index.html) =====
const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  const orderForm = orderDialog.querySelector('.order-form');
  const orderButtons = document.querySelectorAll('.product-card__button');
  const closeButton = document.getElementById('close-order-dialog');
  const closeIconButton = document.getElementById('close-order-dialog-icon');
  const productInput = document.getElementById('order-product');
  const productLabel = document.getElementById('order-dialog-product');

  function resetDialogState() {
    orderForm.reset();
    orderForm.querySelectorAll('input, select, textarea').forEach((field) => {
      if (field.type !== 'hidden') {
        clearError(field);
      }
    });
    orderForm.querySelector('.success-message').hidden = true;
  }

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.dataset.product || '—';
      resetDialogState();
      productInput.value = product;
      productLabel.textContent = product;
      orderDialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => orderDialog.close());
  closeIconButton.addEventListener('click', () => orderDialog.close());

  // Закрытие по клику на тёмный фон за пределами окна
  orderDialog.addEventListener('click', (event) => {
    const rect = orderDialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      orderDialog.close();
    }
  });
}