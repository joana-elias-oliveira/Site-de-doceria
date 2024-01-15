document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("encomenda-form");

    // Carrega dados do armazenamento local e preenche os campos do formulário
    var savedFormData = JSON.parse(localStorage.getItem("encomendaFormData")) || {};
    for (var key in savedFormData) {
        if (savedFormData.hasOwnProperty(key)) {
            var input = form.querySelector('[name="' + key + '"]');
            if (input) {
                input.value = savedFormData[key];
            }
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            alert("Por favor, preencha todos os campos antes de enviar o formulário.");
            return;
        }

        var formData = new FormData(form);

        // Salva os dados do formulário no armazenamento local
        var formDataObject = {};
        formData.forEach(function(value, key){
            formDataObject[key] = value;
        });
        localStorage.setItem("encomendaFormData", JSON.stringify(formDataObject));

        fetch("assets/forms/contact.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                // Exibe o lembrete do cookie lastEncomenda
                showLastVisitReminder();
            } else {
                alert("Erro ao enviar o formulário.");
            }
        })
        .catch(error => {
            console.error("Erro ao enviar formulário:", error);
            alert("Encomenda realizada com sucesso!");
        });
    });

    function validateForm() {
        // Adiciona verificações para garantir que todos os campos obrigatórios sejam preenchidos
        var requiredFields = form.querySelectorAll('[required]');
        for (var i = 0; i < requiredFields.length; i++) {
            if (!requiredFields[i].value.trim()) {
                return false;
            }
        }
        return true;
    }
});



  // script.js

// Função para definir um cookie com a data atual
function setLastEncomendaCookie() {
    var currentDate = new Date();
    // Configura o fuso horário para o Brasil (GMT-3)
    currentDate.setUTCHours(currentDate.getUTCHours() - 0);
    var expirationDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Expira em 30 dias

    document.cookie = "lastEncomenda=" + currentDate.toUTCString() + "; expires=" + expirationDate.toUTCString() + "; path=/";
}

  
  // Função para obter o valor de um cookie específico
  function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
  }
  
  function showLastVisitReminder() {
    var lastEncomenda = getCookie("lastEncomenda");

    if (lastEncomenda) {
        // Converte a data para o formato do Brasil
        var formattedLastEncomenda = new Date(lastEncomenda).toLocaleString("pt-BR");
        alert("Bem-vindo de volta! Sua última encomenda foi em " + formattedLastEncomenda);
    }

    // Atualiza o cookie com a nova data de encomenda
    setLastEncomendaCookie();
    localStorage.removeItem("encomendaFormData"); // Limpa o armazenamento local após o envio bem-sucedido
}


window.onload = showLastVisitReminder;