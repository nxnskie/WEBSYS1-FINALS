const hamburger = document.getElementById("burger-checkbox");
  const navLinks = document.getElementById("navLinks");

  hamburger.onclick = () => {
    navLinks.classList.toggle("active");
  };

   function handleContactSubmit(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const region = document.getElementById('region').value;
      alert(`Thank you, ${name}! We've received your message about ${region}. We'll get back to you soon.`);
      document.querySelector('.contact-form').reset();
    }