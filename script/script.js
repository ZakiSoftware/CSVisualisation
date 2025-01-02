AOS.init({ duration: 1000 });

    // Dark Mode Toggle
    function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
      const toggleButton = document.querySelector('.dark-mode-toggle');
      if (document.body.classList.contains('dark-mode')) {
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }