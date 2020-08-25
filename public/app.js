document.querySelectorAll('.price').forEach((node) => {
  node.textContent = new Intl.NumberFormat('ru-RU', {
    currency: 'usd',
    style: 'currency',
  }).format(node.textContent);
});

const $cart = document.querySelector('.cart');
if ($cart) {
  $cart.addEventListener('click',(event) => {

    if (event.target.classList.contains('js-remove')) {
      fetch(`/cart/remove/${event.target.dataset.id}`, {
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': event.target.dataset.csrf,
        }
      })
        .then((res) => res.json())
        .then(({courses}) => {
          let html = '';
          if (courses.length) {
            html = courses.map((course) => {
             return `
                <div>
                    <div>${course.title}</div>
                    <img src="${course.url}" alt="${course.title}">
                    <div class="price">${course.price}</div>
                </div>
                <div>count: ${course.count}</div>
                <div>total: ${course.count * course.price}</div>
                <button class="js-remove" data-id="${course.id}">Delete</button>
             `
            }).join();
          } else {
            html = `<p>Cart is empty</p>`
          }
          $cart.innerHTML = html;
        })
    }
  });
}


