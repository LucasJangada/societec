document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('image-preview');
  const fileInput = document.getElementById('post-image');
  const roomsLabel = document.getElementById('rooms-label');
  const geralBox = document.getElementById('geral-box');
  const lockBtn = document.getElementById('icon-logged');
  const feed = document.getElementById('feed');

  let lockedOnly = false;
  let selectedColor = '#fff9c4';

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) {
      preview.src = URL.createObjectURL(fileInput.files[0]);
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  });

  document.getElementById('icon-attach').addEventListener('click', () => fileInput.click());

  const updateRoomsLabel = () => {
    const checked = Array.from(document.querySelectorAll('#rooms-list input:checked')).map(i => i.value);
    roomsLabel.textContent = checked.length === 0 ? 'Salas' : (checked.join(', ').slice(0, 30) + (checked.join(', ').length > 30 ? '...' : ''));
    document.getElementById('rooms-toggle').title = checked.join(', ');
  };

  document.querySelectorAll('#rooms-list input').forEach(cb => cb.addEventListener('change', updateRoomsLabel));

  document.getElementById('rooms-toggle').addEventListener('click', () => {
    const list = document.getElementById('rooms-list');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  });

  geralBox.addEventListener('change', () => {
    const allCheckboxes = document.querySelectorAll('#rooms-list input');
    allCheckboxes.forEach(cb => { if (cb !== geralBox) cb.checked = geralBox.checked; });
    updateRoomsLabel();
  });

  lockBtn.addEventListener('click', () => {
    lockedOnly = !lockedOnly;
    lockBtn.textContent = lockedOnly ? '🔒' : '🔓';
    lockBtn.classList.toggle('locked', lockedOnly);
  });

  document.querySelectorAll('.color-option').forEach(opt => {
    opt.addEventListener('click', function () {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      selectedColor = this.dataset.color;
      document.getElementById('new-post-box').style.backgroundColor = selectedColor;
    });
  });

  document.getElementById('btn-post').addEventListener('click', () => {
    const text = document.getElementById('post-text').value.trim();
    if (!text) return;
    const file = fileInput.files[0];
    const rooms = Array.from(document.querySelectorAll('#rooms-list input:checked')).map(i => i.value).join(', ');
    const post = createPost(text, file, rooms, lockedOnly);
    feed.prepend(post);

    document.getElementById('post-text').value = '';
    fileInput.value = '';
    preview.style.display = 'none';
    document.querySelectorAll('#rooms-list input').forEach(i => i.checked = i === geralBox);
    updateRoomsLabel();
    lockedOnly = false;
    lockBtn.textContent = '🔓';
    lockBtn.classList.remove('locked');
    document.getElementById('new-post-box').style.backgroundColor = '#fff';
    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
    document.querySelector('[data-color="#fff9c4"]').classList.add('selected');
    selectedColor = '#fff9c4';
  });

  function createPost(text, file, rooms, locked) {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.style.backgroundColor = selectedColor;
    const now = new Date();
    const timestamp = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
    // Meta
    const meta = document.createElement('div');
    meta.className = 'meta';
    const nome = localStorage.getItem("userName") || "Você";
    meta.textContent = `${nome} • ${rooms}${locked ? ' • Apenas logados' : ''} • ${timestamp}`;
  
    // Conteúdo
    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = text;
  
    // Botão de menu (3 pontinhos)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.textContent = '⋯';
    menuBtn.style.marginLeft = '10px';
    menuBtn.style.cursor = 'pointer';
    menuBtn.style.background = 'transparent';
    menuBtn.style.border = 'none';
    menuBtn.style.fontSize = '18px';
  
    // Container para meta + botão
    const metaContainer = document.createElement('div');
    metaContainer.style.display = 'flex';
    metaContainer.style.alignItems = 'center';
    metaContainer.style.justifyContent = 'space-between';
    metaContainer.appendChild(meta);
    metaContainer.appendChild(menuBtn);
  
    // Menu suspenso
    const submenu = document.createElement('div');
    submenu.className = 'submenu';
    submenu.style.position = 'absolute';
    submenu.style.background = '#fff';
    submenu.style.border = '1px solid #ccc';
    submenu.style.padding = '5px 0';
    submenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    submenu.style.display = 'none';
    submenu.style.zIndex = '1000';
    submenu.style.minWidth = '100px';
    submenu.style.borderRadius = '4px';
  
    const editOption = document.createElement('div');
    editOption.textContent = 'Editar';
    editOption.style.padding = '5px 15px';
    editOption.style.cursor = 'pointer';
    editOption.style.userSelect = 'none';
  
    const deleteOption = document.createElement('div');
    deleteOption.textContent = 'Excluir';
    deleteOption.style.padding = '5px 15px';
    deleteOption.style.cursor = 'pointer';
    deleteOption.style.userSelect = 'none';
  
    submenu.append(editOption, deleteOption);
    postEl.style.position = 'relative'; // para posicionar submenu absoluto dentro do post
    postEl.appendChild(submenu);
  
    // Append principais
    postEl.append(metaContainer, content);
  
    if (file) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      const att = document.createElement('div');
      att.className = 'attachments';
      att.append(img);
      postEl.append(att);
    }
  
    // Ações like e reply
    const actions = document.createElement('div');
    actions.className = 'actions';
  
    const like = document.createElement('span');
    like.className = 'like';
    like.innerHTML = '❤️ <span class="count">0</span>';
  
    const reply = document.createElement('span');
    reply.className = 'reply';
    reply.textContent = '💬 ';
  
    actions.append(like, reply);
    postEl.append(actions);
  
    const replies = document.createElement('div');
    replies.className = 'replies';
    postEl.append(replies);
  
    // Evento abrir/fechar submenu
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });
  
    // Fecha o submenu ao clicar fora
    document.addEventListener('click', () => {
      submenu.style.display = 'none';
    });
  
    // Editar post
    editOption.addEventListener('click', () => {
      submenu.style.display = 'none';
      if (editOption.textContent === 'Editar') {
        // Criar textarea com o texto atual
        const textarea = document.createElement('textarea');
        textarea.value = content.textContent;
        textarea.style.width = '100%';
        textarea.style.boxSizing = 'border-box';
        textarea.rows = 4;
  
        postEl.replaceChild(textarea, content);
        editOption.textContent = 'Salvar';
      } else {
        // Salvar texto editado
        const textarea = postEl.querySelector('textarea');
        if (textarea) {
          content.textContent = textarea.value;
          postEl.replaceChild(content, textarea);
          editOption.textContent = 'Editar';
        }
      }
    });
  
    // Excluir post
    deleteOption.addEventListener('click', () => {
      submenu.style.display = 'none';
      if (confirm('Tem certeza que deseja excluir este post?')) {
        postEl.remove();
      }
    });
  
    // Reply e like mantidos igual
    reply.addEventListener('click', () => {
      if (postEl.querySelector('.reply-box')) return;
      const box = document.createElement('div');
      box.className = 'reply-box';
      box.innerHTML = '<input placeholder="Escreva uma resposta..."><button>Enviar</button>';
      replies.append(box);
  
      box.querySelector('button').addEventListener('click', () => {
        const val = box.querySelector('input').value.trim();
        if (!val) return;
  
        const rep = document.createElement('div');
        rep.className = 'post';
        rep.style.marginTop = '5px';
        rep.style.backgroundColor = selectedColor;
  
        const metaRep = document.createElement('div');
        metaRep.className = 'meta';
        const nome = localStorage.getItem("userName") || "Você";
        metaRep.textContent = `${nome} • ${new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'})}`;
  
        const contentRep = document.createElement('div');
        contentRep.className = 'content';
        contentRep.textContent = val;
  
        rep.append(metaRep, contentRep);
        replies.append(rep);
        box.remove();
      });
    });
  
    like.addEventListener('click', () => {
      const countSpan = like.querySelector('.count');
      let liked = like.classList.toggle('liked');
      countSpan.textContent = liked ? parseInt(countSpan.textContent) + 1 : parseInt(countSpan.textContent) - 1;
      like.innerHTML = `${liked ? '❤️' : '🤍'} <span class="count">${countSpan.textContent}</span>`;
    });
  
    return postEl;
  }
  

  // Sincronização dos checkboxes
  const checkboxes = document.querySelectorAll('#rooms-list input:not(#geral-box)');
  geralBox.addEventListener('change', () => {
    checkboxes.forEach(checkbox => {
      checkbox.checked = geralBox.checked;
    });
    updateRoomsLabel();
  });

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      geralBox.checked = [...checkboxes].every(cb => cb.checked);
      updateRoomsLabel();
    });
  });
});
