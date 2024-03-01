window.onload = function() {
    const formData = document.forms.contact_form;

    formData.onsubmit = function() {
        const nameInput = formData.name;
        const emailInput = formData.email; 
        const messageInput = formData.message
        
        if (!nameInput.value) {
            nameInput.style.background = "red";
            nameInput.focus();
            return false;
        }
        nameInput.style.background = "white";

        if (!emailInput.value) {
            emailInput.style.background = "red";
            emailInput.focus();
            return false;
        }
        emailInput.style.background = "white";

        if (!messageInput.value) {
            messageInput.style.background = "red";
            messageInput.focus();
            return false;
        }
        
        messageInput.style.background = "white";
    }
}