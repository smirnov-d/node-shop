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
      console.log(event.target.dataset.id);

      fetch(`/cart/remove/${event.target.dataset.id}`, {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((cart) => {
          console.log(cart);
          let html = '';
          if (cart.courses.length) {
            html = cart.courses.map((course) => {
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


