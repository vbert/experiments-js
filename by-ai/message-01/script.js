document.addEventListener('DOMContentLoaded', function() {
    function showLoading() {
        const backdrop = document.getElementById('backdrop');
        backdrop.style.display = 'flex';
    }

    function hideLoading() {
        const backdrop = document.getElementById('backdrop');
        backdrop.style.display = 'none';
    }

    function showMessage(message) {
        alert(message);
    }

    function performServerOperation() {
        showLoading();

        // Symulacja operacji serwerowej
        setTimeout(function() {
            hideLoading();
            showMessage('Operacja zakończona sukcesem!');
        }, 3000);
    }

    // Wywołanie funkcji po załadowaniu strony (możesz to zmienić na inny event)
    performServerOperation();
});
