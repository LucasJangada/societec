document.addEventListener('DOMContentLoaded', () => {
  const alunoBtn = document.getElementById("alunoBtn");
  const professorBtn = document.getElementById("professorBtn");
  const emailField = document.getElementById("field-email");
  const rmField = document.getElementById("field-rm");
  const form = document.getElementById("loginForm");

  let tipoUsuario = "aluno";

  alunoBtn.addEventListener("click", () => {
    tipoUsuario = "aluno";
    alunoBtn.classList.add("active");
    professorBtn.classList.remove("active");
    emailField.classList.add("hidden");
    rmField.classList.remove("hidden");
  });

  professorBtn.addEventListener("click", () => {
    tipoUsuario = "professor";
    professorBtn.classList.add("active");
    alunoBtn.classList.remove("active");
    emailField.classList.remove("hidden");
    rmField.classList.add("hidden");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    localStorage.setItem("userName", nome);
    window.location.href = "professor.html";
  });

  window.entrarComoVisitante = function () {
    const opcoes = [
      '1º ADM', '2º ADM', '3º ADM',
      '1º DS', '2º DS', '3º DS',
      '1º MKT', '2º MKT', '3º MKT',
      '1º ELET', '2º ELET', '3º ELET'
    ];

    const select = document.createElement('select');
    select.style.width = '100%';
    select.style.padding = '10px';
    select.style.marginTop = '10px';

    const optionDefault = document.createElement('option');
    optionDefault.text = 'Escolha uma sala';
    optionDefault.disabled = true;
    optionDefault.selected = true;
    select.appendChild(optionDefault);

    opcoes.forEach(sala => {
      const option = document.createElement('option');
      option.value = sala;
      option.textContent = sala;
      select.appendChild(option);
    });

    const confirmar = document.createElement('button');
    confirmar.textContent = 'Confirmar';
    confirmar.style.marginTop = '10px';
    confirmar.style.width = '100%';
    confirmar.style.padding = '10px';

    const container = document.querySelector('.login-box');
    container.innerHTML = '<h2>Visitar como</h2>';
    container.appendChild(select);
    container.appendChild(confirmar);

    confirmar.addEventListener('click', () => {
      const sala = select.value;
      if (sala) {
        localStorage.setItem("userName", `Visitante (${sala})`);
        window.location.href = "professor.html";
      }
    });
  };
});
