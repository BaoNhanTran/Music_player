const buyBtns = document.querySelectorAll('.js-buy-ticket')
        const modal = document.querySelector('.js-modal')
        const closeBtn = document.querySelector('.js-modal-close')
        buyBtns.forEach(function(buyBtn) {
            buyBtn.onclick = function() {
                Object.assign(modal.style, {
                    display: 'flex',
                })
            }
        })
        closeBtn.onclick = function() {
            Object.assign(modal.style, {
                display: 'none',
            })
        }

